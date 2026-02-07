import { useNavigate } from "react-router-dom";
import { 
  User, 
  Crown, 
  CreditCard, 
  PlayCircle, 
  Music, 
  Mail,
  ChevronRight,
  Search,
  HelpCircle
} from "lucide-react";

const Support = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: User,
      title: "Account & Login",
      description: "Sign up, login issues, account settings",
      topics: [
        "Can't log in to my account",
        "Reset password",
        "Update email address",
        "Delete my account"
      ]
    },
    {
      icon: Crown,
      title: "Premium Subscription",
      description: "Everything about premium features",
      topics: [
        "How to upgrade to Premium",
        "Premium features and benefits",
        "When does Premium expire",
        "Premium content not accessible"
      ]
    },
    {
      icon: CreditCard,
      title: "Payment & Billing",
      description: "Payment methods, receipts, refunds",
      topics: [
        "Payment methods accepted",
        "Payment failed",
        "Get payment receipt",
        "Billing questions"
      ]
    },
    {
      icon: PlayCircle,
      title: "Playback Issues",
      description: "Audio not playing, skipping problems",
      topics: [
        "Song won't play",
        "Audio quality issues",
        "Player controls not working",
        "Playlist not loading"
      ]
    },
    {
      icon: Music,
      title: "Content Issues",
      description: "Songs, albums, and playlists",
      topics: [
        "Can't find a song or album",
        "Create and edit playlists",
        "Add songs to playlist",
        "Premium content restrictions"
      ]
    },
    {
      icon: Mail,
      title: "Contact Us",
      description: "Get in touch with support team",
      topics: [
        "Email support",
        "Report a bug",
        "Feature request",
        "General inquiry"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-20">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-green-800 to-gray-900 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <HelpCircle size={48} className="sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-green-400" />
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4">
            How can we help you?
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
            Get answers to your questions and solutions to your problems
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Browse by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-750 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-600 p-3 rounded-lg">
                  <category.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                  <p className="text-gray-400 text-sm">{category.description}</p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {category.topics.map((topic, topicIndex) => (
                  <li
                    key={topicIndex}
                    className="flex items-center justify-between text-gray-300 hover:text-white transition group"
                  >
                    <span className="text-sm">{topic}</span>
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16 bg-gray-800 rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="bg-gray-750 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-lg">
                What's included in Premium?
              </summary>
              <p className="mt-3 text-gray-400">
                Premium gives you access to all premium songs and albums, high quality audio, 
                unlimited listening, and an ad-free experience for just ₹99/month.
              </p>
            </details>

            <details className="bg-gray-750 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-lg">
                How do I upgrade to Premium?
              </summary>
              <p className="mt-3 text-gray-400">
                Click on the "Premium" button in the navigation bar or visit the Pricing page. 
                Choose your plan and complete the payment using UPI, cards, net banking, or wallets.
              </p>
            </details>

            <details className="bg-gray-750 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-lg">
                How long does Premium last?
              </summary>
              <p className="mt-3 text-gray-400">
                Each Premium purchase gives you 30 days of premium access. After 30 days, 
                you can purchase again to continue enjoying premium content.
              </p>
            </details>

            <details className="bg-gray-750 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-lg">
                Why can't I play some songs?
              </summary>
              <p className="mt-3 text-gray-400">
                Songs marked with a crown icon are premium content and require an active Premium 
                subscription. Upgrade to Premium to access all songs and albums.
              </p>
            </details>

            <details className="bg-gray-750 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-lg">
                How do I create a playlist?
              </summary>
              <p className="mt-3 text-gray-400">
                Navigate to any song or album page and click the "Add to Playlist" button. 
                You can manage your playlists from the Playlist page in the sidebar.
              </p>
            </details>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Still need help?</h2>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-full font-bold transition text-sm sm:text-base">
              Contact Support
            </button>
            <button 
              onClick={() => navigate("/")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 sm:px-8 py-3 rounded-full font-bold transition text-sm sm:text-base"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
