import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface HelpDocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentationSection {
  title: string;
  content: string;
  subsections?: DocumentationSection[];
}

const HelpDocumentation: React.FC<HelpDocumentationProps> = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  const documentation: DocumentationSection[] = [
    {
      title: 'Getting Started',
      content: 'Learn the basics of using CredExis for credit dispute management',
      subsections: [
        {
          title: 'Account Setup',
          content: 'Set up your account, configure preferences, and customize your dashboard. Access settings through the profile menu in the top right corner.'
        },
        {
          title: 'Navigation',
          content: 'Use the sidebar for main navigation and the top bar for quick actions. The dashboard provides an overview of your business metrics.'
        }
      ]
    },
    {
      title: 'Client Management',
      content: 'Everything about managing your clients and their cases',
      subsections: [
        {
          title: 'Adding Clients',
          content: 'Add new clients through the Clients section. You can import client data, add individual clients, or use the quick action button (⌘N) for faster access.'
        },
        {
          title: 'Client Profiles',
          content: 'Manage client information, track case progress, and maintain communication history. Access client documents and payment records in one place.'
        }
      ]
    },
    {
      title: 'Dispute Management',
      content: 'Handle credit disputes efficiently with our tools',
      subsections: [
        {
          title: 'Creating Disputes',
          content: 'Start new disputes using the quick action button (⌘D) or through the Disputes section. Use templates for faster processing.'
        },
        {
          title: 'Document Management',
          content: 'Upload and manage client documents (⌘U). Generate and send dispute letters automatically. Track document status and responses.'
        }
      ]
    },
    {
      title: 'Tasks & Workflow',
      content: 'Manage your daily tasks and workflow efficiently',
      subsections: [
        {
          title: 'Task Management',
          content: 'Create, assign, and track tasks. Set priorities, due dates, and reminders. Use filters to organize tasks by status, priority, or assignee.'
        },
        {
          title: 'Automation',
          content: 'Set up automated workflows for recurring tasks. Use templates for common processes. Configure notifications for important updates.'
        }
      ]
    },
    {
      title: 'Payments & Billing',
      content: 'Handle payments and manage billing',
      subsections: [
        {
          title: 'Recording Payments',
          content: 'Record client payments (⌘P) and track payment history. Generate invoices and payment receipts automatically.'
        },
        {
          title: 'Billing Management',
          content: 'Manage subscription plans, view billing history, and handle payment disputes. Access detailed financial reports.'
        }
      ]
    },
    {
      title: 'Reports & Analytics',
      content: 'Track your business performance',
      subsections: [
        {
          title: 'Business Analytics',
          content: 'View key metrics, track success rates, and monitor business growth. Access customizable reports and dashboards.'
        },
        {
          title: 'Client Analytics',
          content: 'Track client progress, success rates, and case statistics. Generate detailed reports for individual clients.'
        }
      ]
    },
    {
      title: 'Settings & Customization',
      content: 'Customize your CredExis experience',
      subsections: [
        {
          title: 'Profile Settings',
          content: 'Update your profile, manage notifications, and customize your dashboard layout.'
        },
        {
          title: 'System Settings',
          content: 'Configure system preferences, manage user roles, and set up integrations with other tools.'
        }
      ]
    }
  ];

  const renderSection = (section: DocumentationSection, level: number = 0) => {
    const isExpanded = expandedSections.has(section.title);
    const Icon = isExpanded ? ChevronDownIcon : ChevronRightIcon;

    return (
      <div key={section.title} className="mb-2">
        <button
          onClick={() => toggleSection(section.title)}
          className="flex items-center w-full text-left py-2 hover:bg-gray-50 rounded-lg px-2"
        >
          <Icon className="h-5 w-5 text-gray-500 mr-2" />
          <span className="font-medium text-gray-900">{section.title}</span>
        </button>
        
        {isExpanded && (
          <div className="pl-7 mt-1">
            <p className="text-gray-600 mb-2">{section.content}</p>
            {section.subsections?.map(subsection => renderSection(subsection, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto w-full max-w-4xl max-h-[90vh] rounded-xl bg-white shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">
              Help Documentation
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {documentation.map(section => renderSection(section))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Need more help?</p>
              <p>Contact our support team at <a href="mailto:support@credexis.com" className="text-indigo-600 hover:text-indigo-500">support@credexis.com</a></p>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default HelpDocumentation; 