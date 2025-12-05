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
import AddItemModal from "./AddItemModal";
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
	const [cryptoHoldings, setCryptoHoldings] = useState([]);
	const [stockHoldings, setStockHoldings] = useState([]);

	const change = 0;
	const totalChange = 0;

	const chartValues = valueHistory.length > 0
	? [...valueHistory, portfolioValue]
	: [portfolioValue];

	const chartDates = updatedAt.length > 0
	? [...updatedAt, new Date()]
	: [new Date()];

	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);

	const toggleTab = (tabNum) => {
		setTabstate(tabNum);
	}

	const fetchHoldings = React.useCallback(async () => {
		if (!token) return;
	  
		const headers = { Authorization: `Bearer ${token}` };
	  
		try {
		  const cryptoRes = await axios.post(process.env.REACT_APP_GET_HOLDINGS, { type: 'crypto' }, { headers });
		  setCryptoHoldings(cryptoRes.data.holdings || []);
	  
		  const stockRes = await axios.post(process.env.REACT_APP_GET_HOLDINGS, { type: 'stock' }, { headers });
		  setStockHoldings(stockRes.data.holdings || []);
	  
		} catch (err) {
		  console.error("Failed to fetch holdings:", err);
		  setCryptoHoldings([]);
		  setStockHoldings([]);
		}
	}, [token]);

	useEffect(() => {
		const fetchUserData = async () => {
			if (!token) {
			  navigate('/login');
			  return;
			}
			try {
				const headers = {
					Authorization: `Bearer ${token}`,
				};
			
				// Fetch user profile info
				const profileRes = await axios.get(process.env.REACT_APP_API_BASE, {
					headers: headers,
				});
			
				if (profileRes.data.success) {
					setName(profileRes.data.name);
					setPortfolioValue(profileRes.data.portfolioValue);
					setValueHistory(profileRes.data.valueHistory);
					setUpdatedAt(profileRes.data.updatedAt);
				} else {
					console.error('Error fetching user data:', profileRes.data.message);
					navigate('/login');
					return;
				}
			
				// Fetch holdings
				await fetchHoldings();

			} catch (error) {
				console.error('Error fetching user data:', error);
				navigate('/login');
			}
		};
		fetchUserData();
	}, [navigate, token, fetchHoldings]); 

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
			<div className={styles.overallValueText}>
				${portfolioValue.toFixed(2)}
			</div>

			{/* --- DAILY CHANGE --- */}
			{change > 0 ? (
				<div className={styles.posPercentageChange}>
				+${change.toFixed(2)} ({((100 * change) / 88).toFixed(2)}%) Day
				</div>
			) : change < 0 ? (
				<div className={styles.negPercentageChange}>
				-${Math.abs(change).toFixed(2)} ({((100 * change) / 88).toFixed(2)}%) Day
				</div>
			) : (
				<div className={styles.noPercentageChange}>
				${change.toFixed(2)} ({((100 * change) / 88).toFixed(2)}%) Day
				</div>
			)}

			{/* --- TOTAL CHANGE --- */}
			{totalChange > 0 ? (
				<div className={styles.posPercentageChange}>
				+${totalChange.toFixed(2)} ({((100 * change) / 88).toFixed(2)}%) Total
				</div>
			) : totalChange < 0 ? (
				<div className={styles.negPercentageChange}>
				-${Math.abs(totalChange).toFixed(2)} ({((100 * change) / 88).toFixed(2)}%) Total
				</div>
			) : (
				<div className={styles.noPercentageChange}>
				${totalChange.toFixed(2)} ({((100 * change) / 88).toFixed(2)}%) Total
				</div>
			)}
			</div>
			<div className={styles.chartContainer}>
				<div className={styles.lineChart}>
					<Line
						data={{
							labels: chartDates.map(date => format(new Date(date), 
								'dd/MM/yyyy')),
							datasets: [{ data: chartValues }],
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
									data: [1, 1, 0, 0, 0],
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
				<AddItemModal
					isOpen={isModalOpen}
					onClose={closeModal}
					onSuccess={fetchHoldings}
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
						<img src={currenciesIcon} alt="Currencies Icon" />Currencies
					</div>
					<div className={tabState === 4 ? `${styles.tab} ${styles.activeTab}` : 
						styles.tab} onClick={() => toggleTab(4)}>
						<img src={commoditiesIcon} alt="Commodities Icon" />Commodities
					</div>

				</div>
				<div className={styles.tabContent}>
					<div className={tabState === 0 ? `${styles.activeContent} ${styles.content}` : styles.content}>
						{stockHoldings.length === 0 ? (
							<p>No stock assets yet.</p>
						) : (
							<ul className={styles.holdingList}>
								<li className={styles.holdingHeader}>
									<span>Ticker</span>
									<span>Amount</span>
									<span>Bought at</span>
									<span>Current</span>
									<span>Value</span>
								</li>
								{stockHoldings.map((s) => (
									<li key={s._id} className={styles.holdingItem}>
										<span>{s.ticker}</span>
										<span>{s.amount}</span>
										<span>${Number(s.purchaseUnitPrice).toFixed(2)}</span>
										<span>${Number(s.currentUnitPrice).toFixed(2)}</span>
										<span>${Number(s.currentValue).toFixed(2)}</span>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className={tabState === 1 ? `${styles.activeContent} ${styles.content}` : styles.content}>
						{cryptoHoldings.length === 0 ? ( 
							<p>No crypto assets yet.</p>
						) : (
							<ul className={styles.holdingList}>
							<li className={styles.holdingHeader}>
								<span>Symbol</span>
								<span>Amount</span>
								<span>Bought at</span>
								<span>Current</span>
								<span>Value</span>
							</li>
							{cryptoHoldings.map((c) => (
								<li key={c._id} className={styles.holdingItem}>
								<span>{c.symbol.toUpperCase()}</span>
								<span>{c.amount}</span>
								<span>${Number(c.purchaseUnitPrice).toFixed(2)}</span>
								<span>${Number(c.currentUnitPrice).toFixed(2)}</span>
								<span>${Number(c.currentValue).toFixed(2)}</span>
								</li>
							))}
							</ul>
						)}
					</div>
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