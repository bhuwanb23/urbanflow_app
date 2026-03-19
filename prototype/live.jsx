import React from "react"

export const Component = () => {
    return (
        <div id="webcrumbs">
            <div className="w-[430px] h-[932px] bg-gray-50 font-sans">
                <div className="h-full flex flex-col">
                    <div className="h-full flex flex-col">
                        <div className="flex-1 bg-white overflow-y-auto">
                            <div className="pt-16 px-6 pb-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800">Live Traffic</h1>
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Live
                                    </div>
                                </div>

                                <div className="relative h-[200px] w-full rounded-xl overflow-hidden mb-6 shadow-md">
                                    <img
                                        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df"
                                        alt="City map"
                                        keywords="traffic, city map, navigation"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                        <span className="material-symbols-outlined text-gray-700">my_location</span>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-lg text-sm font-medium text-gray-700">
                                        Updated 2 mins ago
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Traffic Conditions</h3>
                                        <button className="text-primary-600 text-sm font-medium flex items-center hover:text-primary-700 transition-colors">
                                            <span className="material-symbols-outlined text-sm mr-1">refresh</span>
                                            Refresh
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-center mb-2">
                                                <span className="material-symbols-outlined text-red-500 mr-2">
                                                    trending_up
                                                </span>
                                                <h4 className="font-semibold text-gray-800">High Traffic</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">Main Highway</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">+28% than usual</span>
                                                <span className="text-xs font-medium text-red-500">45 min delay</span>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-center mb-2">
                                                <span className="material-symbols-outlined text-yellow-500 mr-2">
                                                    trending_flat
                                                </span>
                                                <h4 className="font-semibold text-gray-800">Moderate</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">City Center</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Normal flow</span>
                                                <span className="text-xs font-medium text-yellow-500">
                                                    15 min delay
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-center mb-2">
                                                <span className="material-symbols-outlined text-green-500 mr-2">
                                                    trending_down
                                                </span>
                                                <h4 className="font-semibold text-gray-800">Light Traffic</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">Residential Areas</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">-10% than usual</span>
                                                <span className="text-xs font-medium text-green-500">No delays</span>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-center mb-2">
                                                <span className="material-symbols-outlined text-blue-500 mr-2">
                                                    info
                                                </span>
                                                <h4 className="font-semibold text-gray-800">Road Work</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">West Boulevard</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Lane closed</span>
                                                <span className="text-xs font-medium text-blue-500">
                                                    Avoid if possible
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Updates</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="material-symbols-outlined text-red-600">
                                                        report
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">Accident Reported</h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        Major intersection at Park Road and Main Street
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500">2 minutes ago</span>
                                                        <div className="flex items-center space-x-1">
                                                            <span className="text-xs font-medium text-red-500">
                                                                Severe impact
                                                            </span>
                                                            <span className="material-symbols-outlined text-red-500 text-sm">
                                                                warning
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="material-symbols-outlined text-yellow-600">
                                                        construction
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">
                                                        New Construction Zone
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        Highway 101 southbound near exit 25
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500">15 minutes ago</span>
                                                        <div className="flex items-center space-x-1">
                                                            <span className="text-xs font-medium text-yellow-500">
                                                                Moderate delay
                                                            </span>
                                                            <span className="material-symbols-outlined text-yellow-500 text-sm">
                                                                schedule
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="material-symbols-outlined text-green-600">
                                                        event_available
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">Road Cleared</h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        Downtown expressway now open after earlier incident
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500">28 minutes ago</span>
                                                        <div className="flex items-center space-x-1">
                                                            <span className="text-xs font-medium text-green-500">
                                                                Traffic normalizing
                                                            </span>
                                                            <span className="material-symbols-outlined text-green-500 text-sm">
                                                                check_circle
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Routes</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="material-symbols-outlined text-primary-600">
                                                        home
                                                    </span>
                                                    <span className="font-medium">Home</span>
                                                    <span className="text-gray-400 mx-1">→</span>
                                                    <span className="material-symbols-outlined text-blue-600">
                                                        work
                                                    </span>
                                                    <span className="font-medium">Work</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">32 min</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-yellow-500 h-full rounded-full"
                                                    style={{width: "65%"}}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-xs text-gray-500">Usual: 25 min</span>
                                                <span className="text-xs text-yellow-600">Moderate traffic</span>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="material-symbols-outlined text-primary-600">
                                                        home
                                                    </span>
                                                    <span className="font-medium">Home</span>
                                                    <span className="text-gray-400 mx-1">→</span>
                                                    <span className="material-symbols-outlined text-green-600">
                                                        school
                                                    </span>
                                                    <span className="font-medium">School</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">15 min</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-green-500 h-full rounded-full"
                                                    style={{width: "20%"}}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-xs text-gray-500">Usual: 18 min</span>
                                                <span className="text-xs text-green-600">Light traffic</span>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="material-symbols-outlined text-blue-600">
                                                        work
                                                    </span>
                                                    <span className="font-medium">Work</span>
                                                    <span className="text-gray-400 mx-1">→</span>
                                                    <span className="material-symbols-outlined text-orange-600">
                                                        restaurant
                                                    </span>
                                                    <span className="font-medium">Restaurant</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">48 min</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-red-500 h-full rounded-full"
                                                    style={{width: "85%"}}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-xs text-gray-500">Usual: 30 min</span>
                                                <span className="text-xs text-red-600">Heavy traffic</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Transit Status</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary-600">
                                                        train
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-semibold text-gray-800">Metro Line A</h4>
                                                        <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                                                            On time
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">Next train in 4 minutes</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-blue-600">
                                                        directions_bus
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-semibold text-gray-800">Bus Route 42</h4>
                                                        <div className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                                                            Slight delay
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">Next bus in 8 minutes</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-red-600">tram</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-semibold text-gray-800">Tram Line 3</h4>
                                                        <div className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
                                                            Disrupted
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Service suspended due to maintenance
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-t border-gray-200 px-6 py-3 pb-8">
                        <div className="flex justify-between items-center">
                            <button className="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-gray-500 text-2xl">explore</span>
                                <span className="text-xs font-medium text-gray-500">Planner</span>
                            </button>
                            <button className="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-primary-600 text-2xl">traffic</span>
                                <span className="text-xs font-medium text-primary-600">Live</span>
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

                {/* Next: "Add EcoStats screen with charts and environmental impact" */}
                {/* Next: "Add Trips history screen with saved routes" */}
                {/* Next: "Add Profile screen with user preferences" */}
            </div>
        </div>
    )
}
