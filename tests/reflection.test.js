
import { generateReflection } from '../src/reflection.js';
import assert from 'assert';

const bannedWords = [
    'tree', 'car', 'phone', 'cup', 'book', 'street', 'building', 'chair', 'table', 'lamp', 'flower', 'computer', 'screen', 'keyboard', 'bottle', 'shoe', 'bag', 'window', 'door'
];

function testLineCount() {
    console.log('Test: Line Count (4-6 lines)');
    for (let i = 0; i < 20; i++) {
        const text = generateReflection({ seed: Math.random() });
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        assert.ok(lines.length >= 4 && lines.length <= 6, `Expected 4-6 lines, got ${lines.length}`);
    }
    console.log('PASS');
}

function testBannedWords() {
    console.log('Test: No Banned Words');
    // Force specific banned words if possible, or just run many times
    for (let i = 0; i < 50; i++) {
        const text = generateReflection({ seed: Math.random() });
        const lower = text.toLowerCase();
        for (const word of bannedWords) {
            // Simple check, might need word boundary check later if "car" is in "care" (but strictly these are objects)
            // actually "car" is in "scare", "care". So we should be careful.
            // The original sanitize just used .includes(), so we test against that implementation behavior for now,
            // or improved behavior if we fixed it.
            // Let's assume the sanitizer is working as intended or we will fix it.
            if (lower.includes(word)) {
                // Check if it's a false positive like 'flower' in 'sunflower' (which is also banned?)
                // or 'car' in 'care'.
                // For now, let's just log and fail if we see the specific banned word.
                // But wait, the current implementation uses .includes() which IS aggressive.
                // So if we generate "care", it might be censored.
                // Let's verify that banned words do NOT appear.
                assert.ok(!lower.includes(word), `Found banned word "${word}" in: \n${text}`);
            }
        }
    }
    console.log('PASS');
}

function testMoods() {
    console.log('Test: Moods');

    // Night
    const nightText = generateReflection({ brightness: 0.1, warmness: 0.1 });
    assert.ok(nightText.length > 0, "Night text generated");
    // We can't easily assert exact content without exposing internals, but we can check if it runs.

    // Day
    const dayText = generateReflection({ brightness: 0.9, warmness: 0.8 });
    assert.ok(dayText.length > 0, "Day text generated");

    console.log('PASS');
}

try {
    testLineCount();
    testBannedWords();
    testMoods();
    console.log('ALL TESTS PASSED');
} catch (e) {
    console.error('TEST FAILED');
    console.error(e);
    process.exit(1);
}
