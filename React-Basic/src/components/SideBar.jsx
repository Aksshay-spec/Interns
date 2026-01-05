


const Sidebar = ({data}) => {
 
  console.log(data);
  return (
    <div className="sidebar">
      <ul>
        {data ? data.data.map((item) => (
          <li key={item.id}>name : {item.name} email : {item.age}</li>
        )) : <li>Loading...</li>}
      </ul>
    </div>
  );
};

export default Sidebar;
