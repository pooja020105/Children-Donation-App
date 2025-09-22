import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import { Dashboard } from './Dashboard';
import axios from 'axios';

function Organisation() {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [childCount, setChildCount] = useState('');
  const [organisationList, setOrganisationList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [addChild, setAddChild] = useState(false);
  const [childOrgName, setChildOrgName] = useState('');
  const [storeChild, setStoreChild] = useState([]);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [birthday, setBirthday] = useState('');
  const [dream, setDream] = useState('');
  const [interest, setInterest] = useState('');
  const [story, setStory] = useState('');
  const [childimg, setChildImg] = useState('');
  const [childimgFile, setChildImgFile] = useState(null);
  const [editChildData, setEditChildData] = useState(null);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const res = await fetch(`${API_URL}/organisations`);
        const data = await res.json();
        setOrganisationList(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrganisations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const orgId = organisationList[editIndex]._id;
      try {
        const res = await fetch(`${API_URL}/organisations/${orgId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orgName, location, email, description, childCount }),
        });
        const updatedOrg = await res.json();
        const updatedList = [...organisationList];
        updatedList[editIndex] = updatedOrg;
        setOrganisationList(updatedList);
        setEditIndex(null);
        alert('Organization updated successfully!');
      } catch (err) {
        console.log(err);
        alert('Update failed!');
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/organisations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orgName, location, email, description, childCount }),
        });
        const newOrg = await res.json();
        setOrganisationList([...organisationList, newOrg]);
        alert('Organization added successfully!');
      } catch (err) {
        console.log(err);
        alert('Adding organization failed!');
      }
    }

    setShowForm(false);
    setOrgName('');
    setLocation('');
    setEmail('');
    setDescription('');
    setChildCount('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("orgName", childOrgName);
      formData.append("fullName", fullName);
      formData.append("age", age);
      formData.append("birthday", birthday);
      formData.append("dream", dream);
      formData.append("interest", interest);
      formData.append("story", story);
      if (childimgFile) formData.append("childimg", childimgFile);

      if (editChildData) {
        await axios.put(`${API_URL}/children/${editChildData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setStoreChild(prev =>
          prev.map(child =>
            child._id === editChildData._id
              ? { ...child, fullName, age, birthday, dream, interest, story, childimg }
              : child
          )
        );
        alert("Child updated successfully!");
      } else {
        const res = await axios.post(`${API_URL}/children`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setStoreChild([...storeChild, res.data]);
        alert("Child added successfully!");
      }

      setAddChild(false);
      setEditChildData(null);
      setChildImg("");  
      setChildImgFile(null);
      setFullName("");
      setAge("");
      setBirthday("");
      setDream("");
      setInterest("");
      setStory("");
    } catch (err) {
      console.log(err);
      alert(editChildData ? "Failed to update child!" : "Failed to add child!");
    }
  };

  const handleViewDashboard = async (org) => {
    try {
      const res = await fetch(`${API_URL}/children`);
      const data = await res.json();
      setStoreChild(data);
      setSelectedOrg(org);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteChild = async (id) => {
    if (!window.confirm("Are you sure you want to delete this child?")) return;

    try {
      await axios.delete(`${API_URL}/children/${id}`);
      alert("Child deleted successfully!");
      setStoreChild(storeChild.filter(child => child._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete child!");
    }
  };

  return (
    <>
      <div className="mb-2">
        <NavBar />

        {addChild && (
          <form onSubmit={handleFormSubmit}>
            <div className="bg-white shadow-lg rounded-lg m-6 p-4">
              <div className="flex">
                <p className="text-2xl font-bold">{editChildData ? "Edit Child" : "Add New Child"}</p>
                <button
                  onClick={() => setAddChild(false)}
                  className="bg-[#f57f5a] hover:bg-[#e9a67f] rounded-lg pl-5 pr-5 w-5 text-2xl text-white flex justify-center items-center ml-auto"
                  type="button"
                >
                  X
                </button>
              </div>
              <p>{editChildData ? "Update child's profile" : "Create a new profile for a child in your care"}</p>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label className="pt-3 pb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName || ""}
                    placeholder="Enter Name"
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                    required
                  />
                  <label className="pt-3 pb-1">Age</label>
                  <input
                    type="number"
                    value={age || ""}
                    placeholder="Enter Age"
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                    required
                  />
                  <label className="pt-3 pb-1">Birthday</label>
                  <input
                    type="date"
                    value={birthday || ""}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                    required
                  />
                  <label className="pt-3 pb-1">Dream/Aspiration</label>
                  <input
                    type="text"
                    value={dream || ""}
                    placeholder="Becoming an artist"
                    onChange={(e) => setDream(e.target.value)}
                    className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                  />
                  <label className="pt-3 pb-1">Skills & Interests</label>
                  <input
                    type="text"
                    value={interest || ""}
                    placeholder="Drawing, painting, creativity"
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="pt-3 pb-1">Photo Upload</label>
                  <div className="flex flex-col justify-center items-center border-2 border-gray-300 border-dashed p-5 rounded-lg w-full h-full">
                    <i className="fa-solid fa-arrow-up-from-bracket text-4xl"></i>
                    <p className="text-gray-500">Upload Photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setChildImgFile(file);
                          setChildImg(URL.createObjectURL(file));
                        }
                      }}
                    />
                    {childimg && <img src={childimg} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
                  </div>
                  <label className="pt-3 pb-1">Story/Background</label>
                  <input
                    type="text"
                    value={story || ""}
                    placeholder="Share the child's story..."
                    onChange={(e) => setStory(e.target.value)}
                    className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#f57f5a] text-white mt-5 p-2 rounded-lg w-full"
              >
                {editChildData ? "Update Child Profile" : "Add Child Profile"}
              </button>
            </div>
          </form>
        )}

        {!addChild && selectedOrg && (
          <Dashboard
            orgName={selectedOrg.orgName}
            desc={selectedOrg.description}
            location={selectedOrg.location}
            email={selectedOrg.email}
            childrenList={storeChild.filter(
              (child) => child.orgName === selectedOrg.orgName
            )}
            onBack={() => setSelectedOrg(null)}
            onEditChild={(child) => {
              setAddChild(true);
              setEditChildData(child);
              setChildOrgName(child.orgName);
              setFullName(child.fullName || "");
              setAge(child.age || "");
              setBirthday(child.birthday || "");
              setDream(child.dream || "");
              setInterest(child.interest || "");
              setStory(child.story || "");
              setChildImg(`http://localhost:5000${child.childimg}` || "");
            }}
            onDeleteChild={handleDeleteChild}
          />
        )}

        {!addChild && !selectedOrg && (
          <div>
            {!showForm && <div className="flex justify-between items-center px-6 pb-10">
              <div className="px-6 ">
                <p className="text-3xl font-bold bg-gradient-to-r from-[#DB9164] via-[#f4ae88] via-[#f6d3bf] bg-clip-text text-transparent pt-5">
                  Partner Organizations
                </p>
                <p className="text-gray-600">
                  Discover and manage organizations supporting children worldwide
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditIndex(null);
                  }}
                  className="bg-[#f57f5a] text-white px-4 py-2 rounded-lg hover:bg-[#e9a67f] transition duration-300"
                >
                  + Add New Organization
                </button>
              </div>
            </div>}

            {showForm && (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col w-full mt-1 max-w-2xl mx-auto p-5 bg-white border border-gray-300 rounded-lg shadow-md text-left">
                  <div className="mb-1">
                    <p className="text-1xl font-bold">
                      {editIndex !== null ? 'Edit Organization' : 'Register New Organization'}
                    </p>
                    <p className="text-gray-600 font-bold">
                      {editIndex !== null
                        ? 'Update organization details.'
                        : 'Add a new organization to our network of child support partners.'}
                    </p>
                    <div className="flex justify-between ">
                      <div className="flex flex-col">
                        <label className="block mb-1 mt-4">Organization Name</label>
                        <input
                          type="text"
                          value={orgName || ""}
                          onChange={(e) => setOrgName(e.target.value)}
                          className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                          placeholder="Hope Children Foundation"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block mb-1 mt-4">Location</label>
                        <input
                          type="text"
                          value={location || ""}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                          placeholder="Full Address"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-between ">
                      <div className="flex flex-col">
                        <label className="block mb-1 mt-4">Contact Email</label>
                        <input
                          type="email"
                          value={email || ""}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                          placeholder="contact@organisation.org"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block mb-1 mt-4">Number of Children</label>
                        <input
                          type="number"
                          value={childCount || ""}
                          onChange={(e) => setChildCount(e.target.value)}
                          className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                          placeholder="Total children supported"
                          required
                        />
                      </div>
                    </div>
                    <label className="block mb-1 mt-4">Description</label>
                    <textarea
                      value={description || ""}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border-gray-300 p-3 rounded-lg shadow-md"
                      placeholder="Briefly describe the organization's mission and activities."
                      rows="4"
                      required
                    ></textarea>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="bg-white text-black px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 transition duration-300 shadow-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#f57f5a] text-white px-4 py-2 rounded-lg hover:bg-[#e9a67f] transition duration-300"
                      >
                        {editIndex !== null ? 'Update Organisation' : 'Add Organisation'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

           {!showForm && <div className="flex flex-wrap justify-center gap-6 px-6">
              {organisationList.map((item, index) => (
                <div
                  key={index}
                  className="w-80 bg-gray-100 flex flex-col items-start justify-start rounded-lg shadow p-4"
                >
                  <p className="text-2xl font-bold text-black">
                    <span className="bg-[#f57f5a] p-4 pt-2 pb-2 rounded-lg">
                      <i className="fa-solid fa-building"></i>
                    </span>{' '}
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
                      {item.childCount}
                    </p>
                    <p className="text-1xl font-bold text-gray-600 pb-1 text-center">
                      Children
                    </p>
                  </div>
                  <div className="flex justify-around w-full">
                    <button
                      onClick={() => {
                        setEditIndex(index);
                        setOrgName(item.orgName || "");
                        setLocation(item.location || "");
                        setEmail(item.email || "");
                        setChildCount(item.childCount || "");
                        setDescription(item.description || "");
                        setShowForm(true);
                      }}
                      className="bg-white text-black px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 transition duration-300 shadow-md mt-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setAddChild(true);
                        setChildOrgName(item.orgName || "");
                      }}
                      className="bg-white text-black px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 transition duration-300 shadow-md mt-2"
                    >
                      Add Child
                    </button>
                    <button
                      onClick={() => handleViewDashboard(item)}
                      className="bg-[#f57f5a] text-white px-4 py-2 rounded-lg hover:bg-[#c07950] mt-2"
                    >
                      View Dashboard
                    </button>
                  </div>
                </div>
              ))}
            </div>}
          </div>
        )}
      </div>
    </>
  );
}

export default Organisation;
