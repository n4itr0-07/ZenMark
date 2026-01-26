/**
 * Sharing utilities for ZenMark
 * Uses PrivateBin API for storage with ZenMark branding
 * End-to-end encrypted - key never leaves URL fragment
 */

// PrivateBin public instance
const PRIVATEBIN_HOST = 'https://privatebin.net';

// Base58 alphabet (Bitcoin style, no 0, O, I, l)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Encode bytes to base58
 */
function base58Encode(bytes) {
    const digits = [0];
    for (let i = 0; i < bytes.length; i++) {
        let carry = bytes[i];
        for (let j = 0; j < digits.length; j++) {
            carry += digits[j] << 8;
            digits[j] = carry % 58;
            carry = (carry / 58) | 0;
        }
        while (carry > 0) {
            digits.push(carry % 58);
            carry = (carry / 58) | 0;
        }
    }
    // Handle leading zeros
    let output = '';
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
        output += BASE58_ALPHABET[0];
    }
    for (let i = digits.length - 1; i >= 0; i--) {
        output += BASE58_ALPHABET[digits[i]];
    }
    return output;
}

/**
 * Decode base58 to bytes
 */
function base58Decode(str) {
    const bytes = [0];
    for (let i = 0; i < str.length; i++) {
        const value = BASE58_ALPHABET.indexOf(str[i]);
        if (value < 0) throw new Error('Invalid base58 character');
        let carry = value;
        for (let j = 0; j < bytes.length; j++) {
            carry += bytes[j] * 58;
            bytes[j] = carry & 0xff;
            carry >>= 8;
        }
        while (carry > 0) {
            bytes.push(carry & 0xff);
            carry >>= 8;
        }
    }
    // Handle leading zeros
    for (let i = 0; i < str.length && str[i] === BASE58_ALPHABET[0]; i++) {
        bytes.push(0);
    }
    return new Uint8Array(bytes.reverse());
}

/**
 * Generate random bytes
 */
function randomBytes(length) {
    return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Convert bytes to base64
 */
function bytesToBase64(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Convert base64 to bytes
 */
function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Derive encryption key using PBKDF2
 */
async function deriveKey(password, salt, iterations = 100000) {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        password,
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt data for PrivateBin format
 */
async function encryptForPrivateBin(content, format = 'markdown') {
    // Generate random key (32 bytes = 256 bits)
    const masterKey = randomBytes(32);

    // Generate IV (16 bytes) and salt (8 bytes)
    const iv = randomBytes(16);
    const salt = randomBytes(8);
    const iterations = 100000;

    // Derive encryption key
    const encKey = await deriveKey(masterKey, salt, iterations);

    // Prepare paste data (PrivateBin format)
    const pasteData = JSON.stringify({
        paste: content
    });

    // Convert to bytes
    const encoder = new TextEncoder();
    const plaintext = encoder.encode(pasteData);

    // Create adata (authenticated data)
    const adata = [
        [bytesToBase64(iv), bytesToBase64(salt), iterations, 256, 128, 'aes', 'gcm', 'none'],
        format === 'markdown' ? 'markdown' : 'plaintext',
        0, // open discussion
        0  // burn after reading
    ];

    // Encrypt with AES-GCM
    const ciphertext = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
            additionalData: encoder.encode(JSON.stringify(adata)),
            tagLength: 128
        },
        encKey,
        plaintext
    );

    return {
        masterKey,
        payload: {
            v: 2,
            adata: adata,
            ct: bytesToBase64(new Uint8Array(ciphertext)),
            meta: { expire: '1week' }
        }
    };
}

/**
 * Decrypt data from PrivateBin format
 */
async function decryptFromPrivateBin(payload, masterKey) {
    const adata = payload.adata;
    const [ivB64, saltB64, iterations] = adata[0];

    const iv = base64ToBytes(ivB64);
    const salt = base64ToBytes(saltB64);
    const ciphertext = base64ToBytes(payload.ct);

    // Derive key
    const encKey = await deriveKey(masterKey, salt, iterations);

    // Decrypt
    const encoder = new TextEncoder();
    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
            additionalData: encoder.encode(JSON.stringify(adata)),
            tagLength: 128
        },
        encKey,
        ciphertext
    );

    const decoder = new TextDecoder();
    const data = JSON.parse(decoder.decode(decrypted));

    return {
        content: data.paste,
        format: adata[1] === 'markdown' ? 'markdown' : 'text'
    };
}

/**
 * Create a share link by posting to PrivateBin
 */
export async function createShareLink(noteData, options = {}) {
    const { expire = '1week' } = options;

    try {
        if (!crypto.subtle) {
            return { success: false, error: 'Your browser does not support secure sharing.' };
        }

        // Combine title and content
        const fullContent = noteData.title
            ? `# ${noteData.title}\n\n${noteData.content}`
            : noteData.content;

        // Encrypt
        const { masterKey, payload } = await encryptForPrivateBin(
            fullContent,
            noteData.format || 'markdown'
        );

        // Update expiration
        payload.meta.expire = expire;

        // Send to PrivateBin
        const response = await fetch(PRIVATEBIN_HOST, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'JSONHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status !== 0) {
            return { success: false, error: result.message || 'Failed to create share link.' };
        }

        // Build ZenMark URL with PrivateBin ID
        const pasteId = result.id;
        const encodedKey = base58Encode(masterKey);

        // URL format: zenmark.site/share?p=pasteId#key
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/share?p=${pasteId}#${encodedKey}`;

        return {
            success: true,
            url,
            pasteId,
            deleteToken: result.deletetoken
        };
    } catch (err) {
        console.error('Share link creation failed:', err);
        return { success: false, error: 'Failed to create share link. Please try again.' };
    }
}

/**
 * Fetch and decrypt a shared note
 */
export async function fetchSharedNote(pasteId, keyBase58) {
    try {
        // Decode the key
        const masterKey = base58Decode(keyBase58);

        // Fetch from PrivateBin
        const response = await fetch(`${PRIVATEBIN_HOST}/?${pasteId}`, {
            headers: {
                'X-Requested-With': 'JSONHttpRequest'
            }
        });

        const result = await response.json();

        if (result.status !== 0) {
            if (result.status === 1 && result.message?.includes('not found')) {
                return { success: false, error: 'This shared note has expired or been deleted.' };
            }
            return { success: false, error: result.message || 'Failed to fetch shared note.' };
        }

        // Decrypt
        const decrypted = await decryptFromPrivateBin(result, masterKey);

        // Extract title if present (first line starting with #)
        let title = 'Shared Note';
        let content = decrypted.content;

        const lines = content.split('\n');
        if (lines[0]?.startsWith('# ')) {
            title = lines[0].slice(2).trim();
            content = lines.slice(2).join('\n'); // Skip title and blank line
        }

        return {
            success: true,
            noteData: {
                title,
                content,
                format: decrypted.format
            },
            timeToLive: result.meta?.time_to_live
        };
    } catch (err) {
        console.error('Failed to fetch shared note:', err);
        return { success: false, error: 'Failed to decrypt shared note. The link may be invalid.' };
    }
}

/**
 * Check if current URL is a share link
 */
export function isShareRoute() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    return path === '/share' && params.has('p') && window.location.hash.length > 1;
}

/**
 * Get share parameters from URL
 */
export function getShareParams() {
    if (!isShareRoute()) return null;
    const params = new URLSearchParams(window.location.search);
    return {
        pasteId: params.get('p'),
        key: window.location.hash.slice(1) // Remove #
    };
}

// Expiration options for UI
export const EXPIRE_OPTIONS = [
    { value: '5min', label: '5 minutes' },
    { value: '10min', label: '10 minutes' },
    { value: '1hour', label: '1 hour' },
    { value: '1day', label: '1 day' },
    { value: '1week', label: '1 week' },
    { value: '1month', label: '1 month' },
    { value: 'never', label: 'Never' }
];
