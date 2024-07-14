import React, { useEffect, useState } from 'react';


const DashBoard = () => {
	const [name, setName] = useState();
	const [totalValue, setTotalValue] = useState();

	useEffect(() => {
	  	const storedName = localStorage.getItem('username');
	  	if (storedName) {
			setName(storedName);
	  	}
	//   if (username) {
	// 	axios.get(`/api/user/money/${username}`)
	// 	  .then(response => {
	// 		if (response.data.success) {
	// 		  setMoney(response.data.money);
	// 		} else {
	// 		  console.error('Error fetching user money:', response.data.message);
	// 		}
	// 	  })
	// 	  .catch(error => {
	// 		console.error('Error fetching user money:', error);
	// 	  });
	//   }
	}, []);

    return (
    	<h2 className="header">Hi {name}</h2>
  	)
}

export default DashBoard
