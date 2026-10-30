"use client"
import React, { useEffect, useState } from 'react';
import './style.css';

const SeatSelector = () => {
    // const totalSeats = 20;
    // const seatsPerRow = 4;
    const maxSelectableSeats = 3;

    const bookedSeats = [5, 6, 18]; // Example of already booked seats
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatConfig, setseatConfig] = useState({ totalseat: 20, seatperrow:4 })
    // const [totalseat, settotalseat] = useState(0)
    // const [seatperrow, setseatperrow] = useState(0)
    const [totalprice, settotalprice] = useState(0)

    const handleSeatClick = (seat) => {
        if (bookedSeats.includes(seat)) return;

        if (selectedSeats.includes(seat)) {
            setSelectedSeats(prev => prev.filter(s => s !== seat));
        } else {
            if (selectedSeats.length < maxSelectableSeats) {
                setSelectedSeats(prev => [...prev, seat]);
            } else {
                alert(`You can only select up to ${maxSelectableSeats} seats.`);
            }
        }
    };

   const Handleseatconfig = (e)=>{
        const {name , value} = e.target
       setseatConfig((p)=>(
        {...p , [name]: Number(value)}
       ))
   }

    // const tprice = ()=>{
    //     return (selectedSeats.length * 300)
    // }

    const renderSeats = () => {
        const rows = [];

        for (let i = 0; i < seatConfig.totalseat; i += seatConfig.seatperrow) {
            const row = [];

            for (let j = 0; j < seatConfig.seatperrow; j++) {
                const seatNumber = i + j + 1;
                if (seatNumber > seatConfig.totalseat) break;
                const isBooked = bookedSeats.includes(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);

                row.push(
                    <div
                        key={`seat-${seatNumber}`}
                        className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seatNumber)}
                    >
                        {seatNumber}
                    </div>
                );

                // Add aisle space after second seat
                if (j === 1 && seatNumber <= seatConfig.totalseat) {
                    row.push(
                        <div key={`aisle-${seatNumber}`} className="aisle-space" />
                    );
                }
            }

            rows.push(
                <div className={`seat-row ${i + seatConfig.seatperrow >= seatConfig.totalseat ? 'last-row' : ''}`} key={`row-${i}`}>
                    {row}
                </div>
            );
        }

        return rows;
    };

    useEffect(() => {
        settotalprice(selectedSeats.length * 315);
    }, [selectedSeats]);

    return (
        <>
        <div>
                <div>
                <label htmlFor="totalseat"> totalseat </label>
                    <input type="number" onChange={Handleseatconfig} defaultValue={20} min={20} max={80} className='border-2' name="totalseat" id="" />
                    <h2>{seatConfig.totalseat}</h2>
                </div>
                <div className='p-3'>
                    <label htmlFor="seatperrow"> seatperrow </label>
                    <input type="number" onChange={Handleseatconfig} defaultValue={4} min={2} max={6} className='border-2' name="seatperrow" id="" />
                    <h2>{seatConfig.seatperrow}</h2>
                </div>

                
        </div>
        <div className="seat-selector">
            <h2>🚌 Driver Front</h2>
            <div className="seats-container">{renderSeats()}</div>
            <div className="selected-info">
                    <strong>Selected Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(', ') : 'Select seat'}
            </div>

            <div className="h1">
                total Price:
                {
                    totalprice
                }
            </div>
        </div>
        </>
    );
};

export default SeatSelector;
