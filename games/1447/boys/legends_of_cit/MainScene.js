// MainScene.js - Reserved for future expansion
// All scene logic is currently in game.js for better organization
// This file can be used for shared utilities and constants

const GameConstants = {
    PLAYER_SPEED: 200,
    TILE_SIZE: 32,
    SPRITE_SIZE: 64
};

// Utility functions for future use
const GameUtils = {
    // Calculate distance between two points
    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Get random position within bounds
    getRandomPosition(minX, maxX, minY, maxY) {
        return {
            x: Phaser.Math.Between(minX, maxX),
            y: Phaser.Math.Between(minY, maxY)
        };
    }
};