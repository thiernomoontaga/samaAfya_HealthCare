// Utility script to clean up all mock/static data for dynamic testing
// Run this in the browser console or import it when needed

export const cleanupAllData = async () => {
  console.log('🧹 Cleaning up all mock and static data...');

  // Clear localStorage
  const keysToRemove = [
    'currentPatientId',
    'hasUnlockedFeatures',
    'patientName',
    'doctorSession',
    'doctorAuth',
    'selectedConversation'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Removed localStorage key: ${key}`);
  });

  // Clear sessionStorage if needed
  sessionStorage.clear();
  console.log('Cleared sessionStorage');

  // Clean up old glycemia readings from database
  try {
    console.log('🧹 Cleaning up old glycemia readings...');

    // Get all readings
    const response = await fetch('http://localhost:3000/glycemiaReadings');
    const readings = await response.json();

    // Remove readings that belong to old test patients (P001, 0009, 0010, 0011)
    const oldPatientIds = ['P001', '0009', '0010', '0011'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readingsToDelete = readings.filter((reading: any) =>
      oldPatientIds.includes(reading.patientId)
    );

    console.log(`Found ${readingsToDelete.length} old readings to delete`);

    // Delete old readings
    for (const reading of readingsToDelete) {
      await fetch(`http://localhost:3000/glycemiaReadings/${reading.id}`, {
        method: 'DELETE'
      });
    }

    console.log('✅ Old glycemia readings cleaned up');

    // Clean up old messages
    const messagesResponse = await fetch('http://localhost:3000/messages');
    const messages = await messagesResponse.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messagesToDelete = messages.filter((message: any) =>
      oldPatientIds.includes(message.patientId) || message.senderId === 'P001'
    );

    console.log(`Found ${messagesToDelete.length} old messages to delete`);

    for (const message of messagesToDelete) {
      await fetch(`http://localhost:3000/messages/${message.id}`, {
        method: 'DELETE'
      });
    }

    console.log('✅ Old messages cleaned up');

  } catch (error) {
    console.error('❌ Error cleaning up database:', error);
  }

  console.log('✅ All data cleanup completed!');
};

export const resetApplication = async () => {
  console.log('🔄 Resetting application completely...');

  // Clean up all data first
  await cleanupAllData();

  // Reload the application
  console.log('🔄 Reloading application...');
  window.location.reload();
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  // Extend window interface for cleanup utilities
  interface WindowWithCleanup extends Window {
    cleanupAllData?: () => void;
    resetApplication?: () => void;
  }

  const extendedWindow = window as WindowWithCleanup;
  extendedWindow.cleanupAllData = cleanupAllData;
  extendedWindow.resetApplication = resetApplication;

  console.log('💡 Data cleanup utilities available:');
  console.log('   - cleanupAllData() - Clean all stored data');
  console.log('   - resetApplication() - Clean data and reload app');
}