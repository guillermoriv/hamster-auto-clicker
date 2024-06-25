const { remote } = require("webdriverio");

const capabilities = {
  platformName: "Android",
  "appium:deviceName": "Medium_Phone_API_35", // Adjust to match your emulator's device ID
  "appium:appPackage": "org.telegram.messenger.web", // Telegram's package name
  "appium:appActivity": "org.telegram.ui.LaunchActivity", // Telegram's main activity
  "appium:automationName": "UiAutomator2",
  "appium:noReset": true, // Ensure the app's state is preserved between sessions
};

// Function to perform clicks at specified intervals
async function autoClick() {
  const driver = await remote({
    logLevel: "info",
    path: "/",
    capabilities: {
      alwaysMatch: capabilities,
      firstMatch: [{}],
    },
    hostname: "127.0.0.1", // Adjust if your Appium server is on a different host
    port: 4723,
  });

  try {
    while (true) {
      // Infinite loop
      // Wait for the Telegram app to load
      await driver.pause(5000);

      // Get device screen dimensions
      const { width, height } = await driver.getWindowSize();
      console.log("Screen dimensions:", { width, height });

      // Calculate center coordinates
      const centerCoordinates = {
        x: Math.round(width / 2),
        y: Math.round(height / 2),
      };
      console.log("Center coordinates:", centerCoordinates);

      // Number of clicks and interval
      const clickInterval = 120; // Interval in milliseconds
      const clickDuration = 15 * 1000; // 1 minute in milliseconds

      const startTime = Date.now();
      while (Date.now() - startTime < clickDuration) {
        console.log(`Performing click`);
        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              {
                type: "pointerMove",
                duration: 0,
                x: centerCoordinates.x,
                y: centerCoordinates.y,
              },
              { type: "pointerDown", button: 0 },
              { type: "pause", duration: 100 },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await driver.pause(clickInterval);
      }

      console.log("Pausing for 15 seconds...");
      await driver.pause(clickDuration);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await driver.deleteSession();
  }
}

autoClick();
