/**
 * Audio Service
 * Handles sound playback for notifications
 *
 * Features:
 * - Play audio from multiple sound options
 * - Preload and cache audio elements
 * - Handle audio errors gracefully
 * - Support multiple sound formats
 *
 * Important: Audio can only start after user interaction (browser autoplay policy)
 */

export const audioService = {
  // Cache for audio elements
  audioCache: {},

  /**
   * Available notification sounds
   * Each sound object contains the filename and display name
   */
  sounds: {
    bell: {
      name: "Bell",
      file: "/sounds/bell.mp3",
      description: "Classic bell sound",
    },
    soft: {
      name: "Soft",
      file: "/sounds/soft.mp3",
      description: "Gentle, soft chime",
    },
    digital: {
      name: "Digital",
      file: "/sounds/digital.mp3",
      description: "Modern digital beep",
    },
  },

  /**
   * Check if browser supports audio playback
   * @returns {boolean}
   */
  isSupported() {
    return typeof Audio !== "undefined";
  },

  /**
   * Get all available sounds
   * @returns {Object} Sounds object
   */
  getSounds() {
    return this.sounds;
  },

  /**
   * Get audio element for a sound
   * Creates and caches audio element if not already created
   * @param {string} soundKey - Key of the sound from sounds object
   * @returns {HTMLAudioElement} Audio element
   */
  getAudioElement(soundKey) {
    if (!this.audioCache[soundKey]) {
      if (!this.sounds[soundKey]) {
        throw new Error(`Sound "${soundKey}" not found`);
      }

      try {
        const audio = new Audio(this.sounds[soundKey].file);
        audio.preload = "auto";
        audio.volume = 0.8; // Set default volume to 80%

        // Error handling
        audio.addEventListener("error", (e) => {
          console.error(`Audio error for sound ${soundKey}:`, e);
        });

        this.audioCache[soundKey] = audio;
      } catch (error) {
        console.error(`Error creating audio element for ${soundKey}:`, error);
        throw error;
      }
    }

    return this.audioCache[soundKey];
  },

  /**
   * Play a notification sound
   * Can only start after user interaction (browser autoplay policy)
   * @param {string} soundKey - Key of the sound from sounds object
   * @returns {Promise<void>}
   */
  async play(soundKey) {
    if (!this.isSupported()) {
      console.warn("Audio API not supported in this browser");
      return;
    }

    try {
      const audio = this.getAudioElement(soundKey);

      // Stop if already playing and reset
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Reset currentTime and play
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      // DOMException: play() failed because user hasn't interacted with the document yet
      if (error.name === "NotAllowedError") {
        console.warn(
          "Autoplay blocked: Audio can only play after user interaction",
        );
      } else {
        console.error(`Error playing sound ${soundKey}:`, error);
      }
      // Don't throw - fail silently as audio is not critical
    }
  },

  /**
   * Stop playing a sound
   * @param {string} soundKey - Key of the sound from sounds object
   */
  stop(soundKey) {
    try {
      const audio = this.getAudioElement(soundKey);
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.error(`Error stopping sound ${soundKey}:`, error);
    }
  },

  /**
   * Preload all sounds for faster playback
   * Should be called after user interaction
   * @returns {Promise<void>}
   */
  async preloadAllSounds() {
    try {
      const preloadPromises = Object.keys(this.sounds).map(
        (soundKey) =>
          new Promise((resolve) => {
            try {
              const audio = this.getAudioElement(soundKey);
              // Trigger load by playing and immediately pausing
              audio
                .play()
                .then(() => {
                  audio.pause();
                  audio.currentTime = 0;
                  resolve();
                })
                .catch(() => {
                  // Silently fail - audio might not be available yet
                  resolve();
                });
            } catch (error) {
              resolve(); // Continue even if one fails
            }
          }),
      );

      await Promise.all(preloadPromises);
      console.log("All sounds preloaded");
    } catch (error) {
      console.error("Error preloading sounds:", error);
    }
  },

  /**
   * Set volume for a specific sound
   * @param {string} soundKey - Key of the sound
   * @param {number} volume - Volume from 0 to 1
   */
  setVolume(soundKey, volume) {
    try {
      const audio = this.getAudioElement(soundKey);
      audio.volume = Math.max(0, Math.min(1, volume));
    } catch (error) {
      console.error(`Error setting volume for ${soundKey}:`, error);
    }
  },

  /**
   * Get sound display info
   * @param {string} soundKey - Key of the sound
   * @returns {Object|null} Sound info or null if not found
   */
  getSoundInfo(soundKey) {
    return this.sounds[soundKey] || null;
  },

  /**
   * Clear audio cache to free memory
   * Useful if sounds are very large
   */
  clearCache() {
    Object.keys(this.audioCache).forEach((key) => {
      try {
        this.audioCache[key].pause();
        this.audioCache[key].currentTime = 0;
      } catch (error) {
        console.error(`Error clearing cache for ${key}:`, error);
      }
    });
    this.audioCache = {};
  },
};

export default audioService;
