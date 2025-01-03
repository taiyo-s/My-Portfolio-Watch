import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from "./Dashboard.module.css";
import { Chart as defaults } from "chart.js/auto"
import { Line, Pie } from "react-chartjs-2"
import { format } from 'date-fns';
import logo from "../../assets/logo.png";
import stocksIcon from "../../assets/stocks.png";
import cryptoIcon from "../../assets/crypto.png";
import cs2Icon from "../../assets/cs2.png";
import commoditiesIcon from "../../assets/commodities.png";
import currenciesIcon from "../../assets/currencies.png";
import binIcon from "../../assets/bin.png";
import axios from 'axios';
defaults.maintainAspectRatio = false;
defaults.responsive = true;

const DashBoard = () => {
	const token = localStorage.getItem('authToken');
	const [name, setName] = useState('');
	const [portfolioValue, setPortfolioValue] = useState(0);
	const [valueHistory, setValueHistory] = useState([]);
	const [updatedAt, setUpdatedAt] = useState([]);
	const [tabState, setTabstate] = useState(0);
	const navigate = useNavigate();
	const [isModalOpen, setModalOpen] = useState(false);

	const change = 0;

	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);

	const toggleTab = (tabNum) => {
		setTabstate(tabNum);
	}

	useEffect(() => {
		const fetchUserData = async () => {
		  	if (token) {
				try {
					const response = await axios.get(process.env.REACT_APP_API_BASE, {
						headers: {
							'Authorization': `Bearer ${token}`, 
						},
					});
			  		if (response.data.success) {
						setName(response.data.name);
						setPortfolioValue(response.data.portfolioValue);
						setValueHistory(response.data.valueHistory);
						setUpdatedAt(response.data.updatedAt);
			  		} 
					else {
						console.error('Error fetching username', response.data.message);
						navigate('/login');
					}
				} 
				catch (error) {
			 		console.error('Error fetching user data:', error);	
					navigate('/login');					
				}
		  	}
			else {
				navigate('/login');	
			}
		};
		fetchUserData();
	}, [navigate, token]); 

	const handleLogout = () => {
		localStorage.removeItem('authToken');
		navigate('/login');
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
				<div className={styles.overallValueText}>${(portfolioValue).toFixed(2)}</div>
				{change > 0 ? (
  					<div className={styles.posPercentageChange}>
    					+${change.toFixed(2)} ({((100 * change) / 88).toFixed(2)}%)
  					</div>
					) : change < 0 ? (
  					<div className={styles.negPercentageChange}>
    					-${Math.abs(change).toFixed(2)} ({((100 * change)/88).toFixed(2)}%)
  					</div>
					) : (
  					<div className={styles.noPercentageChange}>
    					+${change.toFixed(2)} ({((100 * change) / 88).toFixed(2)}%)
  					</div>
				)}
			</div>
			<div className={styles.chartContainer}>
				<div className={styles.lineChart}>
					<Line
						data={{
							labels: updatedAt.map(date => format(new Date(date), 
								'dd/MM/yyyy')),
							datasets: [{ data: valueHistory }],
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
				<div className={styles.pieChart}>
					<Pie
						data={{
							labels: ['Stocks', 'Crypto', 'CS2 Skins', 'Currencies', 'Commodities'],
							datasets: [
								{
									label: 'Value of Holdings',
									data: [7, 5, 8, 3, 4],
									backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
								},
							],
						}}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: {
									onClick: null,
								},
								tooltip: {
									displayColors: false,
								},
							},
						}}
					/>
				</div>
			</div>

			<div className={styles.addRemove}>
				<button className={styles.addButton} onClick={openModal}>
					<span>+</span> Add
				</button>
				<button className={styles.removeButton}>
					<img src={binIcon} alt="Remove" className={styles.binIcon} /> Remove
				</button>
			{isModalOpen && (
				<div className={styles.modalOverlay}>
					<div className={styles.modal}>
						<button className={styles.closeButton} onClick={closeModal}>
						&times;
						</button>
						<div className={styles.modalContent}>
						{/* modal content here */}
						</div>
					</div>
				</div>
			)}
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
						<img src={currenciesIcon} alt="Currencies Icon" />Currencies
					</div>
					<div className={tabState === 4 ? `${styles.tab} ${styles.activeTab}` : 
						styles.tab} onClick={() => toggleTab(4)}>
						<img src={commoditiesIcon} alt="Commodities Icon" />Commodities
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
			<div className={styles.footer}>
				<div className={styles.footerLinks}>
					<Link to="/about-us" className={styles.footerLink}>About Us</Link>
					<Link to="/contact" className={styles.footerLink}>Contact</Link>
					<Link to="/faq" className={styles.footerLink}>FAQ</Link>
				</div>
			</div>
		</div>
  	)
}

export default DashBoard