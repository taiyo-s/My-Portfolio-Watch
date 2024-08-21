import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Dashboard.module.css";
import { Chart as defaults } from "chart.js/auto"
import { Line } from "react-chartjs-2"
import { format } from 'date-fns';
import logo from "../../assets/logo.png";
import stocksIcon from "../../assets/stocks.png";
import cryptoIcon from "../../assets/crypto.png";
import cs2Icon from "../../assets/cs2.png";
import commoditiesIcon from "../../assets/commodities.png";
import currenciesIcon from "../../assets/currencies.png";
import axios from 'axios';
defaults.maintainAspectRatio = false;
defaults.responsive = true;

const DashBoard = () => {
	const username = localStorage.getItem('username');
	const [name, setName] = useState();
	const [portfolioValue, setPortfolioValue] = useState([]);
	const [updatedDates, setUpdatedDates] = useState([]);
	const [tabState, setTabstate] = useState(0);
	const navigate = useNavigate();

	const toggleTab = (tabNum) => {
		setTabstate(tabNum);
	}

	useEffect(() => {
		const fetchUserData = async () => {
		  	if (username) {
				try {
			  		const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}${username}`, 
						{ withCredentials: true });
			  		if (response.data.success) {
						setName(response.data.name);
						setPortfolioValue(response.data.portfolioValue);
						setUpdatedDates(response.data.updatedDates);
			  		} 
					else {
						console.error('Error fetching user name', response.data.message);
						navigate('/login');
			  		}
				} 
				catch (error) {
			 		console.error('Error fetching user data:', error);
				}
		  	}
		};
		fetchUserData();
	}, [navigate, username]); 

	const handleLogout = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_POST_ROUTE_LOGOUT, 
				{}, { withCredentials: true });
            if (response.status === 200) {
				navigate('/login');
            }	
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
		<div className={styles.container}>
            <div className={styles.header}>
				<div className={styles.brandContainer}>
        			<img src={logo} alt="My Portfolio Watch Logo" />
        			<div className={styles.headerText}>My Portfolio Watch</div>
    			</div>
				<button onClick={handleLogout} className={styles.logout}>Logout</button>
            </div>
			<div className={styles.greeting}>
				<h2 className={styles.greetingText}>Hi {name}</h2>
			</div>
			<div className={styles.overallValue}>
				<div className={styles.overallValueText}>${portfolioValue[0]}</div>
				<div className={10-8 > 0 ? styles.posPercentageChange : 
					10-8 < 0 ? styles.negPercentageChange : 
					styles.noPercentageChange}>+$20.12 (12.52%)</div>
			</div>
			<div className={styles.chartContainer}>
				<Line
					className={styles.chart}
					data={{
						labels: updatedDates.map(date => format(new Date(date), 
							'MM/dd/yyyy')),
                        datasets: [{ data: portfolioValue }],
                    }}
					options={{
						responsive: true,
						maintainAspectRatio: false,
						scales: {
							x: { grid: { display: false } },
							y: { beginAtZero: true, grid: { display: false } },
						},
						plugins: {
							legend: {
								display: false,
								onClick: null,
							},
							tooltip: {
								displayColors: false,
							},
						},
					}}
				/>
			</div>
			
			
			<div className={styles.tabsContainer}>
				<div className={styles.blockTabs}>
					<div className={tabState === 0 ? `${styles.tab} ${styles.activeTab}` : 
						styles.tab} onClick={() => toggleTab(0)}>
						<img src={stocksIcon} alt="Stocks Icon" />Stocks
					</div>
					<div className={tabState === 1 ? `${styles.tab} ${styles.activeTab}` : 
						styles.tab} onClick={() => toggleTab(1)}>
						<img src={cryptoIcon} alt="Crypto Icon" />Crypto
					</div>
					<div className={tabState === 2 ? `${styles.tab} ${styles.activeTab}` : 
						styles.tab} onClick={() => toggleTab(2)}>
						<img src={cs2Icon} alt="CS2 Skin Icon" />CS2Skins
					</div>
					<div className={tabState === 3 ? `${styles.tab} ${styles.activeTab}` : 
						styles.tab} onClick={() => toggleTab(3)}>
						<img src={commoditiesIcon} alt="Commodities Icon" />Commodities
					</div>
					<div className={tabState === 4 ? `${styles.tab} ${styles.activeTab}` : 
						styles.tab} onClick={() => toggleTab(4)}>
						<img src={currenciesIcon} alt="Currencies Icon" />Currencies
					</div>
				</div>
				<div className={styles.tabContent}>
					<div className={tabState === 0 ? `${styles.activeContent} ${styles.content}` : 
						styles.content}>Hi 0</div>
					<div className={tabState === 1 ? `${styles.activeContent} ${styles.content}` : 
						styles.content}>Hi 1</div>
					<div className={tabState === 2 ? `${styles.activeContent} ${styles.content}` : 
						styles.content}>Hi 2</div>
					<div className={tabState === 3 ? `${styles.activeContent} ${styles.content}` : 
						styles.content}>Hi 3</div>
					<div className={tabState === 4 ? `${styles.activeContent} ${styles.content}` : 
						styles.content}>Hi 4</div>
				</div>
			</div>
		</div>
  	)
}

export default DashBoard