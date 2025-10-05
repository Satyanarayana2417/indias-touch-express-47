import { useState } from "react";
import { ChevronDown, ChevronUp, PackageX } from "lucide-react";

interface ProhibitedItem {
  name: string;
  reason: string;
  image: string;
}

interface CollapsibleProhibitedCardProps {
  title: string;
  description: string;
  headerImage: string;
  items: ProhibitedItem[];
  colorScheme: 'red' | 'orange' | 'purple' | 'teal' | 'slate';
  prohibitionMessage: string;
}

const CollapsibleProhibitedCard = ({
  title,
  description,
  headerImage,
  items,
  colorScheme,
  prohibitionMessage
}: CollapsibleProhibitedCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const colorClasses = {
    red: {
      header: 'bg-red-50',
      hover: 'hover:bg-red-50',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600',
      overlay: 'bg-red-600/10',
      overlayIcon: 'bg-red-600',
      notice: 'bg-red-50',
      noticeText: 'bg-red-100 text-red-800'
    },
    orange: {
      header: 'bg-orange-50',
      hover: 'hover:bg-orange-50',
      icon: 'bg-orange-100 text-orange-600',
      text: 'text-orange-600',
      overlay: 'bg-orange-600/10',
      overlayIcon: 'bg-orange-600',
      notice: 'bg-orange-50',
      noticeText: 'bg-orange-100 text-orange-800'
    },
    purple: {
      header: 'bg-purple-50',
      hover: 'hover:bg-purple-50',
      icon: 'bg-purple-100 text-purple-600',
      text: 'text-purple-600',
      overlay: 'bg-purple-600/10',
      overlayIcon: 'bg-purple-600',
      notice: 'bg-purple-50',
      noticeText: 'bg-purple-100 text-purple-800'
    },
    teal: {
      header: 'bg-teal-50',
      hover: 'hover:bg-teal-50',
      icon: 'bg-teal-100 text-teal-600',
      text: 'text-teal-600',
      overlay: 'bg-teal-600/10',
      overlayIcon: 'bg-teal-600',
      notice: 'bg-teal-50',
      noticeText: 'bg-teal-100 text-teal-800'
    },
    slate: {
      header: 'bg-slate-50',
      hover: 'hover:bg-slate-50',
      icon: 'bg-slate-100 text-slate-600',
      text: 'text-slate-600',
      overlay: 'bg-slate-600/10',
      overlayIcon: 'bg-slate-600',
      notice: 'bg-slate-50',
      noticeText: 'bg-slate-100 text-slate-800'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className="max-w-4xl mx-auto mt-4 md:mt-8">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg border md:border-0 border-gray-100">
        {/* Main Card - Clickable Header - Enhanced for Mobile */}
        <div 
          onClick={toggleExpanded}
          className={`cursor-pointer ${colors.hover} transition-all duration-200 active:scale-[0.98] md:active:scale-100 select-none`}
        >
          <div className={`${colors.header} p-3 md:p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Category Image */}
                <div className={`w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden mr-3 md:mr-4 flex-shrink-0`}>
                  <img
                    src={headerImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-2xl font-bold text-primary mb-1 truncate">{title}</h2>
                  <p className="text-soft-gray text-sm md:text-base line-clamp-2 md:line-clamp-none">{description}</p>
                  <p className={`text-xs ${colors.text} mt-1 font-medium block md:hidden`}>
                    {isExpanded ? 'Tap to collapse' : `Tap to view ${items.length} items`}
                  </p>
                  <p className={`text-xs ${colors.text} mt-1 font-medium hidden md:block`}>
                    {isExpanded ? 'Click to collapse' : `Click to view ${items.length} restricted items`}
                  </p>
                </div>
              </div>
              {/* Expand/Collapse Icon - Enhanced for Mobile */}
              <div className={`flex items-center justify-center w-10 h-10 md:w-10 md:h-10 ${colors.icon} rounded-full flex-shrink-0 ml-2 shadow-sm`}>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 md:h-5 md:w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5 md:h-5 md:w-5" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Content - Enhanced Mobile Dropdown Animation */}
        {isExpanded && (
          <div className="p-3 md:p-6 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {items.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 ${colors.overlay} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <div className={`${colors.overlayIcon} text-white rounded-full p-2 md:p-2`}>
                        <PackageX className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2 md:p-4">
                    <h3 className="font-semibold text-primary text-xs md:text-sm mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-soft-gray line-clamp-2 md:line-clamp-none">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Prohibition Notice */}
            <div className={`mt-3 md:mt-6 p-3 md:p-4 ${colors.notice} rounded-lg`}>
              <div className="flex items-center justify-center">
                <span className={`${colors.noticeText} text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center`}>
                  <PackageX className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                  <span className="text-center">{prohibitionMessage}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleProhibitedCard;
