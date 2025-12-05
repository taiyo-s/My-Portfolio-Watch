    import React, { useState } from "react";
    import axios from "axios";
    import styles from "./AddItemModal.module.css";

    const AddItemModal = ({ isOpen, onClose, onSuccess }) => {
    /* ────── state ────── */
    const [step, setStep]           = useState(1);
    const [type, setType]           = useState("");   // "stock" | "crypto"
    const [keyword, setKeyword]     = useState("");
    const [amount, setAmount]       = useState("");
    const [price, setPrice]         = useState("");
    const [searching, setSearching] = useState(false);
    const [results, setResults]     = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [searched, setSearched]   = useState(false);

    if (!isOpen) return null; 

    const close   = () => { 
        setStep(1);
        setType("");
        setKeyword("");
        setAmount("");
        setPrice("");
        setSearching(false);
        setResults([]);
        setSelectedAsset(null);
        setSearched(false);
        onClose(); 
    };
    const next = () => setStep((s) => s + 1);
    const back = () => {
        setStep((s) => s - 1);
        setKeyword("");
        setResults([]);
        setSelectedAsset(null);
        setSearched(false);
      };

    const valid =
        (step === 1 && type) ||
        (step === 2 && selectedAsset) ||
        (step === 3 && amount && price) ||
        step === 4;

    /* ────── API calls ────── */
    const handleSearch = async () => {
        if (!keyword.trim()) return;
        setSearching(true);
        setSearched(false);
        setResults([]);
        setSelectedAsset(null);

        const assetSearchEndpoints = {
            crypto: process.env.REACT_APP_CRYPTO_SEARCH,
            stock: process.env.REACT_APP_STOCK_SEARCH,
        };
    
        try {
        const url = assetSearchEndpoints[type];
    
        const { data } = await axios.get(url, {
            params: { q: keyword.trim() },
        });
    
        setResults(data);
        setSearched(true);
        } catch (err) {
        console.error(err);
        } finally {
        setSearching(false);
        }
    };

    const handleSubmit = async () => {
        const payload = {
            type,
            assetId: selectedAsset._id,
            amount,
            price,
        };
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(process.env.REACT_APP_ASSET_ADD, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (onSuccess) onSuccess();
            close();
        } catch (err) {
            console.error("Error adding asset:", err);
        }
    };

    /* ────── step content ────── */
    const renderStep = () => {
        switch (step) {
        case 1:
            return (
            <>
                <h3>Select asset type</h3>
                <button
                onClick={() => setType("stock")}
                className={type === "stock" ? styles.selected : ""}
                >
                Stock
                </button>
                <button
                onClick={() => setType("crypto")}
                className={type === "crypto" ? styles.selected : ""}
                >
                Crypto
                </button>
            </>
            );

        case 2:
            return (
            <>
                <h3>Search {type === "stock" ? "Stock" : "Crypto"}</h3>
                <div className={styles.searchRow}>
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={`Enter ${type} symbol or name`}
                />
                <button disabled={!keyword.trim()} onClick={handleSearch}>
                    Search
                </button>
                </div>

                {searching && <p>Searching…</p>}

                {searched && !searching && results.length > 0 && (
                <ul className={styles.resultList}>
                    {results.map((asset) => (
                    <li
                        key={asset._id}
                        onClick={() => setSelectedAsset(asset)}
                        className={
                        selectedAsset?._id === asset._id ? styles.selected : undefined
                        }
                    >
                        {(() => {
                            if (type === "stock") {
                            return `${asset.ticker} - ${asset.name}`;
                            } else if (type === "crypto") {
                            return `${asset.symbol?.toUpperCase()} - ${asset.name}`;
                            } else {
                            return `${asset.name}`;
                            }
                        })()}
                    </li>
                    ))}
                </ul>
                )}

                {searched && !searching && results.length === 0 && (
                <p>No matches for “{keyword}”.</p>
                )}
            </>
            );

        case 3:
            const estimatedValue = parseFloat(amount || 0) * parseFloat(price || 0);
            return (
                <>
                <h3>Purchase details</h3>
            
                {/* Amount field */}
                <div className={styles.field}>
                    <label htmlFor="amount">Amount</label>
                    <input
                    id="amount"
                    type="number"
                    className={styles.inputLarge}
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            
                {/* Price field */}
                <div className={styles.field}>
                    <label htmlFor="price">Price</label>
                    <input
                    id="price"
                    type="number"
                    className={styles.inputLarge}
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className={styles.estimatedValue}>
                    Estimated Value: ${isNaN(estimatedValue) ? "0.00" : estimatedValue.toFixed(2)}
                </div>
                </>
            );

            case 4: {
                const displayType = type ? type[0].toUpperCase() + type.slice(1) : "";
                
                return (
                    <>
                    <h3>Review</h3>
                    <p>Type: {displayType}</p>
                    <p>Symbol: {selectedAsset.symbol}</p>
                    <p>Amount: {amount}</p>
                    <p>Price: {price}</p>
                    <button onClick={handleSubmit}>Add to portfolio</button>
                    </>
                );
                }

        default:
            return null;
        }
    };

    /* ────── render ────── */
    return (
        <div className={styles.overlay}>
        <div className={styles.modal}>
            <button onClick={close} className={styles.close}>
            &times;
            </button>

            {renderStep()}

            <div className={styles.nav}>
            {step > 1 && <button onClick={back}>Back</button>}
            {step < 4 && (
                <button disabled={!valid} onClick={next}>
                Next
                </button>
            )}
            </div>
        </div>
        </div>
    );
    };

    export default AddItemModal;