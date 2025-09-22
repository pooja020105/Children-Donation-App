import API_URL from '../config'; 

export const Dashboard = ({
  orgName,
  desc,
  location,
  email,
  childrenList,
  onBack,
  onEditChild,
  onDeleteChild,
}) => {
  
  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div>
            <button
              onClick={onBack}
              className="hover:[#f57f5a] text-black rounded-lg pt-6 p-5"
            >
              <i className="fa-solid fa-arrow-left-long"></i> Back to Organisation
            </button>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#DB9164] via-[#f4ae88] via-[#f5bb9a] bg-clip-text text-transparent pt-5 px-6">
              {orgName}
            </p>
            <p className="text-1xl text-gray-600 px-6 pt-2">{desc}</p>
            <p className="text-1xl text-gray-600 px-6 pt-2">
              <i className="fa-solid fa-location-dot"></i> {location}
            </p>
            <p className="text-1xl text-gray-600 px-6 pt-2">
              <i className="fa-solid fa-envelope"></i> {email}
            </p>
          </div>
        </div>

        <div className="flex flex-col mt-5 justify-center gap-6 px-6">
          {childrenList.length > 0 ? (
            childrenList.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 flex items-center justify-between rounded-lg shadow p-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={`${API_URL}${item.childimg}`}
                    alt={item.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex flex-col justify-center gap-1">
                    <p className="text-1xl font-bold text-[#f57f5a]">{item.fullName}</p>
                    <div className="flex gap-5">
                      <p className="text-1xl font-medium text-gray-600">
                        <span className="font-bold text-black">Age:</span> {item.age}
                      </p>
                      <p className="text-1xl font-medium text-gray-700">
                        <span className="font-bold text-black">DOB:</span> {item.birthday}
                      </p>
                    </div>
                    <div className="flex gap-5">
                      <p className="text-1xl font-medium text-gray-500">
                        <span className="font-bold text-black">Dream:</span> {item.dream}
                      </p>
                      <p className="text-1xl font-bold text-gray-500">
                        <span className="font-bold text-black">Interest:</span> {item.interest}
                      </p>
                    </div>
                    <p className="text-1xl font-bold text-gray-500">
                      <span className="font-bold text-black">Story:</span> {item.story}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    className="bg-[#f57f5a] text-white px-4 py-2 rounded-lg hover:bg-[#c07950]"
                    onClick={() => onEditChild(item)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteChild(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center">
              No children added for this organisation yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
