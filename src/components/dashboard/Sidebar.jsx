import React, { useState } from "react";
import { BookOpen, Users, User, BarChart, ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleExpand = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections = [
    {
      id: "overview",
      name: "Overview",
      icon: <BookOpen className="w-5 h-5" />,
      hasDropdown: false,
      path: "/dashboard",
    },
    {
      id: "aptitude",
      name: "Aptitude",
      icon: <BarChart className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: "aptitude-learning", name: "Learning", path: "/aptitude/learning" },
        { id: "aptitude-practice", name: "Practice", path: "/aptitude/practice" },
      ],
    },
    {
      id: "groupDiscussion",
      name: "Group Discussion",
      icon: <Users className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: "gd-learning", name: "Learning", path: "/GD/learning" },
        { id: "gd-practice", name: "Practice", path: "/GD/practice" },
      ],
    },
    {
      id: "interview",
      name: "Interview",
      icon: <User className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: "interview-learning", name: "Learning", path: "/interview/learning" },
        { id: "interview-practice", name: "Practice", path: "/interview/practice" },
      ],
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: <BarChart className="w-5 h-5" />,
      hasDropdown: false,
      path: "/analytics",
    },
    {
      id: "profile",
      name: "Profile",
      icon: <User className="w-5 h-5" />,
      hasDropdown: false,
      path: "/profile",
    }
  ];

  // Helper function to safely check if activeSection starts with a prefix
  const isActive = (sectionId) => {
    return activeSection && activeSection.toString().startsWith(sectionId);
  };

  // Handle navigation and active section setting
  const handleItemClick = (sectionId, path) => {
    setActiveSection(sectionId);
    router.push(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>
      <nav className="mt-2">
        <ul>
          {sections.map((section) => (
            <li key={section.id} className="mb-1">
              {section.hasDropdown ? (
                <div>
                  <button
                    onClick={() => toggleExpand(section.id)}
                    className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isActive(section.id)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    <span>{section.name}</span>
                    <span className="ml-auto">
                      {expandedSections[section.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {expandedSections[section.id] && (
                    <ul className="ml-8 mt-1">
                      {section.dropdownItems.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleItemClick(item.id, item.path)}
                            className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                              activeSection === item.id
                                ? "text-blue-600 font-medium"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleItemClick(section.id, section.path)}
                  className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{section.icon}</span>
                  <span>{section.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;