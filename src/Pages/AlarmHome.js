import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import moment from 'moment';

let intervalId = null;
export default function AlarmHome() {
	const [time, setTime] = useState(new Date());
	const history = useHistory();
	useEffect(() => {
		intervalId = setInterval(() => {
			setTime(new Date());
		}, 1000);
		setInterval(() => {
			checkAlarm();
		}, 1000);

		const checkAlarm = () => {
			let existAlarm = localStorage.getItem('alarmList');
			existAlarm = JSON.parse(existAlarm);
			!existAlarm
				? localStorage.setItem('alarmList', JSON.stringify([]))
				: existAlarm.map((m) => {
						const time = `${m.hours}:${m.minutes} ${m.meridian}`;
						const currentDate = moment().format('hh:mm A');
						if (
							time === currentDate &&
							m.alarmOn &&
							m.repeat.includes(moment().format('dddd')) &&
							m.on
						) {
							history.push({ pathname: '/alarmRing', state: m.id });
						}
				  });
		};

		return () => {
			clearInterval(intervalId);
		};
	}, [history]);

	return (
		<div className="alarmhome-container">
			<div className="heading">Clock</div>
			<div className="time-date-container">
				<div className="time">{moment(time, 'HHmmss').format('HH:mm:ss')}</div>
				<div className="date">{moment().format('MMMM Do YYYY')}</div>
			</div>
			<div className="existing-alram-container"></div>
			<div className="alarm-action-container">
				<NavLink to="/">
					<button className="alarm-btn">Clock</button>
				</NavLink>
				<NavLink to="/alarmList">
					<button className="alarm-btn">Alarm</button>
				</NavLink>
			</div>
		</div>
	);
}
