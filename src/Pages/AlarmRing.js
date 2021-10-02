import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import radar from '../sound/radar.mp3';
import beep from '../sound/beep.wav';

export default function AlarmRing(props) {
	const [ringAlarm, setRingAlaram] = useState(null);
	const [time, setTime] = useState(new Date());
	const [audio, setAudio] = useState(new Audio(beep));
	const [alarmList, setAlarmList] = useState([]);
	const [play, setPlay] = useState(false);

	const history = useHistory();

	useEffect(() => {
		let intervalId = setInterval(() => {
			setTime(new Date());
		}, 1000);
		let existAlarm = localStorage.getItem('alarmList');
		existAlarm = JSON.parse(existAlarm);
		existAlarm.map((m) => {
			if (m.id === props.location.state) {
				setAudio(new Audio(m.sound === 'radar' ? radar : beep));
				setRingAlaram(m);
			}
			setAlarmList(existAlarm);
			return null;
		});
		return () => {
			clearInterval(intervalId);
		};
	}, [props.location.state]);

	useEffect(() => {
		play ? audio.play() : audio.pause();
	}, [play]);

	const stopAlarm = () => {
		audio.pause();
		const newAlarmList = alarmList.map((m) => {
			if (ringAlarm.id === m.id) {
				m.alarmOn = false;
				return m;
			} else {
				return m;
			}
		});
		localStorage.setItem('alarmList', JSON.stringify(newAlarmList));
		history.push('/');
	};

	return (
		<div className="alarm-ring-container">
			<div className="ring-heading">Alarm Ringing !</div>
			<div className="time-date-container">
				<div className="time">{moment(time, 'HHmmss').format('HH:mm:ss')}</div>
				<div className="date">{moment().format('dddd Do MMMM YYYY')}</div>
			</div>
			<div className="alarm-label">{ringAlarm?.label}</div>
			<div className="btn-container">
				{ringAlarm?.snooze && <button className="snooze">Snooze</button>}
				<button className="stop" onClick={() => stopAlarm()}>
					Stop
				</button>
				<button className="stop" onClick={() => setPlay(!play)}>
					{play ? 'Stop sound' : 'Play Sound'}
				</button>
			</div>
		</div>
	);
}
