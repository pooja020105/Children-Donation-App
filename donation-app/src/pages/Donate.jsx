import { useState, useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import API_URL from '../config';

function Donate() {
  const [donationType, setDonationType] = useState('Monetary Donation');
  const [child, setChild] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [childrenList, setChildrenList] = useState([]);
  const [orgEmail, setOrgEmail] = useState('');
  const [organisationList, setOrganisationList] = useState([]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await fetch(`${API_URL}/children`);
        const data = await res.json();
        setChildrenList(data);
      } catch (err) { console.error(err); }
    };

    const fetchOrganisations = async () => {
      try {
        const res = await fetch(`${API_URL}/organisations`);
        const data = await res.json();
        setOrganisationList(data);
      } catch (err) { console.error(err); }
    };

    fetchChildren();
    fetchOrganisations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donationData = { donationType, child, contact, message, orgEmail };

    try {
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Donation submitted and email sent successfully!');
        setDonationType('Monetary Donation');
        setChild('');
        setContact('');
        setMessage('');
        setOrgEmail('');
      } else {
        alert(data.message || 'Failed to submit donation');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting donation');
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center text-center px-6 pb-10">
        <p className="text-5xl font-bold bg-gradient-to-r from-[#DB9164] via-[#e9a67f] to-[#ecccb8] bg-clip-text text-transparent mt-12">
          Make a Donation
        </p>
        <p className="mt-6 text-lg md:text-xl font-semibold text-gray-600 max-w-3xl">
          Your generosity can transform a child's life.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-2xl mx-auto mt-6 p-5 bg-white border border-gray-300 rounded-lg shadow-md text-left"
        >
          <div className="mb-4">
            <p className="text-2xl font-bold">Donation Details</p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Donation Type</label>
            <select
              value={donationType}
              onChange={(e) => setDonationType(e.target.value)}
              className="w-full border-gray-300 p-3 rounded-lg shadow-md"
            >
              <option>Monetary Donation</option>
              <option>Dream Item</option>
              <option>Education Support</option>
              <option>Skill Development</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Select Organisation Email</label>
            <select
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              className="w-full border-gray-300 p-3 rounded-lg shadow-md"
              required
            >
              <option value="">-- Select Organisation --</option>
              {organisationList.map((org) => (
                <option key={org._id} value={org.email}>
                  {org.email} {org.orgName ? `(${org.orgName})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Select Child (Optional)</label>
            <select
              value={child}
              onChange={(e) => setChild(e.target.value)}
              className="w-full border-gray-300 p-3 rounded-lg shadow-md"
            >
              <option value="">-- Select a Child --</option>
              {childrenList.map((c) => (
                <option key={c._id} value={c.fullName}>
                  {c.fullName} {c.dream ? `- Dreams of ${c.dream}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Contact Number</label>
            <input
              type="number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone Number"
              className="w-full border-gray-300 p-3 rounded-lg shadow-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Message to Child (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a heartfelt message..."
              className="w-full border-gray-300 p-3 rounded-lg shadow-md min-h-[80px]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#f57f5a] mt-5 text-white p-2 rounded-lg w-full hover:bg-[#e9a67f] transition-colors"
          >
            Complete Donation
          </button>
        </form>
      </div>
    </>
  );
}

export default Donate;
