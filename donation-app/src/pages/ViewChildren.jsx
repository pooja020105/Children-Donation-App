import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import axios from "axios";
import API_URL from '../config'; 


export function ViewChildren() {
  const [orgs, setOrgs] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    fetchOrgs();
    fetchChildren();
  }, []);

  const fetchOrgs = async () => {
    try {
      const res = await axios.get(`${API_URL}/organisations`);
      setOrgs(res.data);
    } catch (error) {
      console.error("Error fetching organisations:", error);
    }
  };

  const fetchChildren = async () => {
    try {
      const res = await axios.get(`${API_URL}/children`);
      setChildren(res.data);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  if (selectedOrg) {
    const orgChildren = children.filter(
      (c) => c.orgName === selectedOrg.orgName
    );

    return (
      <div>
        <NavBar />
        <div className="px-6 mt-6">
          <button
            onClick={() => setSelectedOrg(null)}
            className="bg-gray-300 px-3 py-2 rounded-lg mb-4"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold mb-3">{selectedOrg.orgName} Dashboard</h1>
          <p className="text-gray-600 mb-6">{selectedOrg.description}</p>

          {orgChildren.length > 0 ? (
            <ul className="space-y-4">
              {orgChildren.map((child, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{child.fullName}</p>
                    <p className="text-gray-500 text-sm">
                      Age: {child.age} | Dream: {child.dream}
                    </p>
                    {child.story && (
                      <p className="text-gray-500 text-sm">Story: {child.story}</p>
                    )}
                  </div>
                  {child.childimg && (
                    <img
  src={`${API_URL}${child.childimg}`}
  alt={child.fullName}
  className="w-16 h-16 rounded-full object-cover"
/>

                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No children found for this organisation.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="px-6 mt-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#DB9164] via-[#f4ae88] via-[#f6d3bf] bg-clip-text text-transparent pb-3">
          Partner Organizations & Children
        </h1>
        <p className="text-gray-600 mb-6">
          View all children associated with partner organizations
        </p>

        <div className="flex flex-wrap justify-center gap-6 px-6">
          {orgs.length === 0 ? (
            <p className="text-gray-500">No organisations available.</p>
          ) : (
            orgs.map((item, index) => (
              <div
                key={index}
                className="w-80 bg-gray-100 flex flex-col items-start justify-start rounded-lg shadow p-4"
              >
                <p className="text-2xl font-bold text-black">
                  <span className="bg-[#f57f5a] p-4 pt-2 pb-2 rounded-lg">
                    <i className="fa-solid fa-building"></i>
                  </span>{" "}
                  {item.orgName}
                </p>
                <p className="text-1xl font-medium text-gray-600 pt-3 pb-2">
                  {item.description}
                </p>
                <p className="text-1xl font-medium text-gray-700 pb-1">
                  <i className="fa-solid fa-location-dot"></i> {item.location}
                </p>
                <p className="text-1xl font-medium text-gray-500 mt-1">
                  <i className="fa-solid fa-envelope"></i> {item.email}
                </p>
                <hr className="w-full border border-gray-400 my-4" />
                <div className="flex flex-col justify-between w-full">
                  <p className="text-3xl font-bold text-[#f57f5a] pt-1 text-center">
                    {children.filter((c) => c.orgName === item.orgName).length}
                  </p>
                  <p className="text-1xl font-bold text-gray-600 pb-1 text-center">
                    Children
                  </p>
                </div>
                <div className="flex justify-around w-full">
                  <button
                    onClick={() => setSelectedOrg(item)}
                    className="bg-[#f57f5a] text-white px-4 py-2 rounded-lg hover:bg-[#c07950] mt-2"
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
