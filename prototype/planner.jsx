import React from "react"

export const Component = () => {
    return (
        <div id="webcrumbs">
            <div className="w-[430px] h-[932px] bg-gray-50 font-sans">
                <div className="h-full flex flex-col">
                    <div className="flex-1 bg-white overflow-y-auto">
                        <div className="pt-16 px-6 pb-4">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Hello, Bhuwan 👋</h1>
                                <p className="text-gray-600">Where do you want to go today?</p>
                            </div>

                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter destination"
                                    className="w-full bg-gray-100 rounded-2xl px-4 py-4 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <span className="material-symbols-outlined absolute left-4 top-4 text-gray-500">
                                    search
                                </span>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Mode</h3>
                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                    <button className="flex-shrink-0 bg-primary-100 text-primary-700 px-4 py-3 rounded-xl flex items-center space-x-2 hover:bg-primary-200 transition-colors">
                                        <span className="text-lg">🚉</span>
                                        <span className="text-sm font-medium">Train</span>
                                    </button>
                                    <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                                        <span className="text-lg">🚌</span>
                                        <span className="text-sm font-medium">Bus</span>
                                    </button>
                                    <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                                        <span className="text-lg">🚖</span>
                                        <span className="text-sm font-medium">Auto</span>
                                    </button>
                                    <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                                        <span className="text-lg">🚶</span>
                                        <span className="text-sm font-medium">Walk</span>
                                    </button>
                                    <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                                        <span className="text-lg">🚗</span>
                                        <span className="text-sm font-medium">All</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Travel Gallery</h3>
                                <div className="mb-4">
                                    <div className="flex overflow-x-auto space-x-3 pb-2">
                                        <button className="flex-shrink-0 px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all">
                                            All
                                        </button>
                                        <button className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                                            Grayscale
                                        </button>
                                        <button className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                                            Sepia
                                        </button>
                                        <button className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                                            Blur
                                        </button>
                                        <button className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                                            Saturate
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    <div className="group relative rounded-xl overflow-hidden h-40 shadow-sm hover:shadow-md transition-all">
                                        <img
                                            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
                                            alt="Metro station"
                                            keywords="travel, metro, urban, transportation"
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:grayscale"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                            <span className="text-white text-sm font-medium">Metro Station</span>
                                        </div>
                                    </div>

                                    <div className="group relative rounded-xl overflow-hidden h-40 shadow-sm hover:shadow-md transition-all">
                                        <img
                                            src="https://images.unsplash.com/photo-1596432150438-3ef028cca147"
                                            alt="Scenic bus route"
                                            keywords="bus, travel, scenic, transportation"
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:sepia"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                            <span className="text-white text-sm font-medium">Scenic Bus Route</span>
                                        </div>
                                    </div>

                                    <div className="group relative rounded-xl overflow-hidden h-40 shadow-sm hover:shadow-md transition-all">
                                        <img
                                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxhdXRvfGVufDB8fHx8MTc1MjYzODAyOHww&ixlib=rb-4.1.0&q=80&w=1080"
                                            alt="Auto rickshaw"
                                            keywords="auto, rickshaw, transportation, travel"
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:contrast-125"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                            <span className="text-white text-sm font-medium">Auto Ride</span>
                                        </div>
                                    </div>

                                    <div className="group relative rounded-xl overflow-hidden h-40 shadow-sm hover:shadow-md transition-all">
                                        <img
                                            src="https://images.unsplash.com/photo-1487956382158-bb926046304a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx3YWxraW5nfGVufDB8fHx8MTc1MjYzODAyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                                            alt="Walking path"
                                            keywords="walking, path, nature, travel"
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:saturate-150"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                            <span className="text-white text-sm font-medium">Walking Path</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-center">
                                    <button className="flex items-center space-x-2 text-primary-600 font-medium hover:text-primary-700 transition-colors">
                                        <span>View all photos</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Smart Route Suggestions</h3>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-green-600">
                                                        train
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">Metro + Walk</h4>
                                                    <p className="text-sm text-gray-600">Fastest route</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-800">28 min</p>
                                                <p className="text-sm text-gray-600">₹45</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <span className="material-symbols-outlined text-green-600 text-sm">
                                                        landscape
                                                    </span>
                                                    <span className="text-sm font-medium text-green-600">
                                                        Eco Score: 92
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="material-symbols-outlined text-gray-500 text-sm">
                                                        co2
                                                    </span>
                                                    <span className="text-sm text-gray-600">2.1 kg saved</span>
                                                </div>
                                            </div>
                                            <button className="bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                                                View Route
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-blue-600">
                                                        directions_bus
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">Bus Direct</h4>
                                                    <p className="text-sm text-gray-600">Most comfortable</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-800">42 min</p>
                                                <p className="text-sm text-gray-600">₹25</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <span className="material-symbols-outlined text-green-600 text-sm">
                                                        landscape
                                                    </span>
                                                    <span className="text-sm font-medium text-green-600">
                                                        Eco Score: 88
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="material-symbols-outlined text-gray-500 text-sm">
                                                        co2
                                                    </span>
                                                    <span className="text-sm text-gray-600">1.8 kg saved</span>
                                                </div>
                                            </div>
                                            <button className="bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                                                View Route
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-yellow-600">
                                                        local_taxi
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">Auto Rickshaw</h4>
                                                    <p className="text-sm text-gray-600">Budget friendly</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-800">35 min</p>
                                                <p className="text-sm text-gray-600">₹80</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <span className="material-symbols-outlined text-yellow-600 text-sm">
                                                        landscape
                                                    </span>
                                                    <span className="text-sm font-medium text-yellow-600">
                                                        Eco Score: 65
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="material-symbols-outlined text-gray-500 text-sm">
                                                        co2
                                                    </span>
                                                    <span className="text-sm text-gray-600">0.8 kg saved</span>
                                                </div>
                                            </div>
                                            <button className="bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                                                View Route
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-t border-gray-200 px-6 py-3 pb-8">
                        <div className="flex justify-between items-center">
                            <button className="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-primary-600 text-2xl">explore</span>
                                <span className="text-xs font-medium text-primary-600">Planner</span>
                            </button>
                            <button className="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-gray-500 text-2xl">traffic</span>
                                <span className="text-xs font-medium text-gray-500">Live</span>
                            </button>
                            <button className="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-gray-500 text-2xl">landscape</span>
                                <span className="text-xs font-medium text-gray-500">EcoStats</span>
                            </button>
                            <button className="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-gray-500 text-2xl">receipt_long</span>
                                <span className="text-xs font-medium text-gray-500">Trips</span>
                            </button>
                            <button className="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-gray-500 text-2xl">person</span>
                                <span className="text-xs font-medium text-gray-500">Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Next: "Add Live traffic screen with real-time updates" */}
                {/* Next: "Add EcoStats screen with charts and environmental impact" */}
                {/* Next: "Add Trips history screen with saved routes" */}
                {/* Next: "Add Profile screen with user preferences" */}
            </div>
        </div>
    )
}
