export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* Account Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Account information</h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Legal name</h3>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4 text-sm sm:text-base">ALEX JAMES RODRIGUEZ</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Residency</h3>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 text-sm sm:text-base">United States of America</span>
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Emails</h3>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="text-gray-700 text-sm sm:text-base">alex@example.com • from Google</div>
                <div className="text-gray-500 text-xs sm:text-sm">alex@example.com</div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Social • X</h3>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4 text-sm sm:text-base">Active • @alexrodriguez</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">Change account</button>
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Telegram bot</h3>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="text-gray-700 text-sm sm:text-base">Not activated</div>
                <div className="text-gray-500 text-xs sm:text-sm">
                  Access group-exclusive chats and connect the Superfanbot for faster deal notifications.
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Leaderboard visibility</h3>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="text-gray-700 text-sm sm:text-base">Pseudonym • Friendly-Ocean-Dolphin</div>
                <div className="text-gray-500 text-xs sm:text-sm">
                  This is how other users will see you in the leaderboard.
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Investor information</h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-medium">Unlock more deals and larger allocations</h3>
            </div>
            <p className="text-gray-600 mb-4">
              If you have over $5m in investment assets you can be classified as a Qualified Purchaser.
            </p>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Become qualified
            </button>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Able to invest</h3>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4 text-sm sm:text-base">Requires certification</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">Complete certification</button>
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Identity</h3>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 text-sm sm:text-base">Verified</span>
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Tax ID</h3>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 text-sm sm:text-base">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Security</h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Two Factor Auth.</h3>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="text-gray-700 text-sm sm:text-base">1 method enabled • Authenticator app</div>
                <div className="text-gray-500 text-xs sm:text-sm">Passkey also available</div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
