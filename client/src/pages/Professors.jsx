import React, { useState } from 'react';
import { Search, Mail, Phone, GraduationCap, Lightbulb } from 'lucide-react';
import professors from "../data/professors"
// Sample professors data for demonstration



const Professors = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic
  const filteredProfessors = professors.filter((prof) =>
    (prof.name + prof.email + prof.areaOfInterest + (prof.qualification || ''))
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            ECE Professors
          </h1>
          <p className="text-gray-300 text-lg">Meet our distinguished faculty members</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, interest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Professors Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[75vh] pr-2">
          {filteredProfessors.length > 0 ? (
            filteredProfessors.map((prof, index) => (
              <div
                key={index}
                className="group bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-black/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                {/* Professor Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">
                      {prof.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                      {prof.name}
                    </h2>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                    <Phone className="w-4 h-4 mr-3 text-purple-400" />
                    <span className="text-sm">{prof.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                    <Mail className="w-4 h-4 mr-3 text-purple-400" />
                    <a 
                      href={`mailto:${prof.email}`} 
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline"
                    >
                      {prof.email}
                    </a>
                  </div>
                  
                  <div className="flex items-start text-gray-300 group-hover:text-white transition-colors duration-300">
                    <GraduationCap className="w-4 h-4 mr-3 text-purple-400 mt-1 flex-shrink-0" />
                    <span className="text-sm">{prof.qualification}</span>
                  </div>
                  
                  <div className="flex items-start text-gray-300 group-hover:text-white transition-colors duration-300">
                    <Lightbulb className="w-4 h-4 mr-3 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-purple-300 mb-1">Areas of Interest:</p>
                      <p className="text-sm leading-relaxed">{prof.areaOfInterest}</p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">No professors found matching your search.</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Results Counter */}
        {filteredProfessors.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredProfessors.length} of {professors.length} professors
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Professors;