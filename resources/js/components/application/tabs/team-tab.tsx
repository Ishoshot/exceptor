import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaEllipsisH, FaEnvelope, FaKey, FaShieldAlt, FaUserEdit, FaUserPlus, FaUsers } from 'react-icons/fa';

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'developer' | 'viewer';
    avatar: string;
    last_active: string;
    status: 'online' | 'away' | 'offline';
    joined_at: string;
    contributions: number;
    recent_activity: {
        action: string;
        timestamp: string;
    }[];
}

interface TeamTabProps {
    teamMembers: TeamMember[];
}

export const TeamTab: React.FC<TeamTabProps> = ({ teamMembers }) => {
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Mock pending invitations
    const pendingInvitations = [
        {
            id: 1,
            email: 'alex.wilson@example.com',
            role: 'Developer',
            sentAt: '2 days ago',
        },
        {
            id: 2,
            email: 'sarah.brown@example.com',
            role: 'Viewer',
            sentAt: '5 days ago',
        },
    ];

    // Role badge color mapping
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Owner':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'Admin':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Developer':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Viewer':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    // Avatar background color mapping
    const getAvatarBgColor = (name: string) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];

        // Simple hash function to get consistent color for the same name
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    // Invite modal component
    const InviteModal = () => (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Invite Team Member</h3>
                    <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="colleague@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Role
                        </label>
                        <select
                            id="role"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="admin">Admin</option>
                            <option value="developer">Developer</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Personal Message (Optional)
                        </label>
                        <textarea
                            id="message"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="I'd like to invite you to collaborate on our application..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowInviteModal(false)}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Send Invitation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 p-4">
            {/* Header with invite button */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Team Members</h2>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    <FaUserPlus className="mr-2 -ml-1 h-4 w-4" />
                    Invite Team Member
                </button>
            </div>

            {/* Team members list */}
            <div className="overflow-hidden bg-white shadow sm:rounded-md dark:bg-gray-800">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {teamMembers.map((member) => (
                        <li key={member.id}>
                            <div className="flex items-center px-4 py-4 sm:px-6">
                                <div className="flex min-w-0 flex-1 items-center">
                                    <div
                                        className={`h-10 w-10 flex-shrink-0 rounded-full ${getAvatarBgColor(member.name)} flex items-center justify-center font-medium text-white`}
                                    >
                                        {member.avatar}
                                    </div>
                                    <div className="min-w-0 flex-1 px-4">
                                        <div>
                                            <p className="truncate text-sm font-medium text-blue-600 dark:text-blue-400">{member.name}</p>
                                            <p className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <FaEnvelope className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                                <span className="truncate">{member.email}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-5 flex flex-shrink-0 items-center space-x-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(member.role.charAt(0).toUpperCase() + member.role.slice(1))}`}
                                    >
                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                    </span>
                                    <span className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">Active {member.last_active}</span>
                                    <div className="relative flex-shrink-0">
                                        <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                                            <FaEllipsisH className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Pending invitations */}
            {pendingInvitations.length > 0 && (
                <div className="mt-8">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Pending Invitations</h3>
                    <div className="overflow-hidden bg-white shadow sm:rounded-md dark:bg-gray-800">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {pendingInvitations.map((invitation) => (
                                <li key={invitation.id}>
                                    <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center">
                                                <FaEnvelope className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{invitation.email}</p>
                                            </div>
                                            <div className="mt-1 flex items-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(invitation.role)}`}
                                                >
                                                    {invitation.role}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Sent {invitation.sentAt}</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 flex-shrink-0">
                                            <button className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Role permissions info */}
            <div className="mt-8 overflow-hidden bg-white p-6 shadow sm:rounded-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Role Permissions</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                <FaKey className="h-3 w-3" />
                            </span>
                            Owner
                        </h4>
                        <p className="mt-1 ml-8 text-sm text-gray-500 dark:text-gray-400">
                            Full access to all features, including billing, team management, and application settings.
                        </p>
                    </div>

                    <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                <FaShieldAlt className="h-3 w-3" />
                            </span>
                            Admin
                        </h4>
                        <p className="mt-1 ml-8 text-sm text-gray-500 dark:text-gray-400">
                            Can manage team members, application settings, and view all data. Cannot access billing.
                        </p>
                    </div>

                    <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                <FaUserEdit className="h-3 w-3" />
                            </span>
                            Developer
                        </h4>
                        <p className="mt-1 ml-8 text-sm text-gray-500 dark:text-gray-400">
                            Can view and manage errors, logs, and performance data. Cannot modify application settings.
                        </p>
                    </div>

                    <div>
                        <h4 className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                <FaUsers className="h-3 w-3" />
                            </span>
                            Viewer
                        </h4>
                        <p className="mt-1 ml-8 text-sm text-gray-500 dark:text-gray-400">
                            Read-only access to errors, logs, and performance data. Cannot modify any settings.
                        </p>
                    </div>
                </div>
            </div>

            {/* Invite modal */}
            {showInviteModal && <InviteModal />}
        </motion.div>
    );
};
