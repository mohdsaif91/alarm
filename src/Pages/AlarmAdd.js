import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import radar from '../sound/radar.mp3';
import beep from '../sound/beep.wav';

const initialState = {
	hours: 'HH',
	minutes: 'MM',
	meridian: 'PM',
	snooze: true,
	label: '',
	repeat: [],
	sound: 'none',
	id: null,
	alarmOn: true,
	timeStamp: null,
	on: true,
};

const errorData = {
	error: false,
	text: null,
};
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
let minutes = [];

export default function AlarmAdd(props) {
	const [alarm, setAlarm] = useState({ ...initialState });
	const [error, setError] = useState({ ...errorData });
	const [audio, setAudio] = useState(new Audio(null));
	const [play, setPlay] = useState(false);

	const history = useHistory();

	useEffect(() => {
		if (props.location.aboutProp) {
			const al = localStorage.getItem('alarmList');
			const selectedAlram = JSON.parse(al).filter(
				(f) => f.id === props.location.aboutProp.alarmId
			);
			setAlarm(selectedAlram[0]);
			geterateMinutes();
		} else {
			setAlarm({ ...alarm, id: randomStr(10) });
			geterateMinutes();
		}
	}, []);

	useEffect(() => {
		play ? audio.play() : audio.pause();
	}, [play]);

	const geterateMinutes = () => {
		for (let i = 0; i <= 60; i++) {
			if (i <= 9) {
				minutes.push(`0${i}`);
			} else {
				minutes.push(i);
			}
		}
	};

	const randomStr = (length) => {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	};

	const saveAlarm = () => {
		setPlay(false);
		if (alarm.repeat.length === 0) {
			setError({ ...error, error: true, text: 'Please provide the days' });
		} else if (!alarm.hours || !alarm.minutes || !alarm.meridian) {
			setError({ ...error, error: true, text: 'Required feild are not filled' });
		} else {
			let existAlarm = localStorage.getItem('alarmList');
			existAlarm = !existAlarm ? [] : JSON.parse(existAlarm);

			if (props.location?.aboutProp?.alarmId) {
				const newAlarmList = existAlarm.map((f) => {
					if (f.id === props.location.aboutProp.alarmId) {
						return alarm;
					} else {
						return f;
					}
				});
				localStorage.setItem('alarmList', JSON.stringify(newAlarmList));
				history.push('/');
				return;
			}
			localStorage.setItem('alarmList', JSON.stringify([...existAlarm, alarm]));
			history.push('/');
		}
	};

	const addRepeat = (checked, day) => {
		if (checked) {
			setAlarm({ ...alarm, repeat: [...alarm.repeat, day] });
		} else {
			const filterAlarm = alarm.repeat.filter((f) => f !== day);
			setAlarm({ ...alarm, repeat: filterAlarm });
		}
	};

	const radioChange = (sound) => {
		setAlarm({ ...alarm, sound });
		setAudio(new Audio(sound === 'none' ? null : sound === 'radar' ? radar : beep));
		setPlay(sound !== 'none');
	};

	return (
		<div className="alarm-add-container">
			<div className="alarmadd-heading">
				<NavLink to="/alarmList">
					<button className="alarm-btn">Cancle</button>
				</NavLink>
				<div>Alarm/Edit</div>
				<NavLink to="/alarmAdd">
					<button className="alarm-btn">Save</button>
				</NavLink>
			</div>
			<div className="sub-heading">
				<div className="sub-heading-alarm">SELECT TIME</div>
			</div>
			<div className="time-label">
				<div className="select-container">
					<select
						value={alarm.hours}
						onChange={(e) => setAlarm({ ...alarm, hours: e.target.value })}
					>
						<option value="HH" selected>
							HH
						</option>
						{hours.map((m) => {
							return <option value={m}>{m}</option>;
						})}
					</select>
					<select
						value={alarm.minutes}
						onChange={(e) => setAlarm({ ...alarm, minutes: e.target.value })}
					>
						<option value="MM" selected>
							MM
						</option>
						{minutes.map((m) => {
							return <option value={m}>{m}</option>;
						})}
					</select>
					<select
						value={alarm.meridian}
						onChange={(e) => setAlarm({ ...alarm, meridian: e.target.value })}
					>
						<option value="AM">AM</option>
						<option value="PM">PM</option>
					</select>
				</div>
				<div className="config-container">
					<p className="item-select selected">
						<label href="#" for="Snooze" className="">
							<span>Snooze</span>
						</label>
						<input
							type="checkbox"
							checked={alarm.snooze}
							onChange={(e) => setAlarm({ ...alarm, snooze: e.target.checked })}
							className="chekbox-snooz"
						/>
					</p>
					<p className="item-select selected">
						<label href="#" for="Snooze" className="">
							<span>Label</span>
						</label>
						<input
							type="text"
							onChange={(e) => setAlarm({ ...alarm, label: e.target.value })}
							value={alarm.label}
						/>
					</p>
				</div>
			</div>
			<div className="repeat-container center-container">
				<div className="sub-heading-alarm">REPEAT</div>
				<ul className="list">
					{days.map((m) => (
						<li className="item select selected">
							<label href="#" for={m}>
								<span>{m}</span>
							</label>
							<input
								type="checkbox"
								checked={alarm.repeat.includes(m)}
								onChange={(e) => addRepeat(e.target.checked, `${m}`)}
								id={`${m}`}
							/>
						</li>
					))}
				</ul>
			</div>
			<div className="sound-container center-container">
				<div className="sub-heading-alarm">SOUND</div>
				<ul className="list">
					<li className="item select selected">
						<label href="#" for="none">
							<span>None</span>
						</label>
						<input
							type="radio"
							onChange={() => radioChange('none')}
							// onChange={(e) => setAlarm({ ...alarm, sound: 'none' })}
							checked={alarm.sound === 'none'}
							id="none"
						/>
					</li>
					<li className="item select selected">
						<label href="#" for="radar">
							<span>Radar</span>
						</label>
						<input
							type="radio"
							onChange={() => radioChange('radar')}
							// onChange={() => setAlarm({ ...alarm, sound: 'radar' })}
							checked={alarm.sound === 'radar'}
							id="radar"
						/>
					</li>
					<li className="item select selected">
						<label href="#" for="beep">
							<span>Beep</span>
						</label>
						<input
							type="radio"
							onChange={() => radioChange('beep')}
							checked={alarm.sound === 'beep'}
							id="beep"
						/>
					</li>
				</ul>
			</div>
			<div className="add-alarm-action">
				<div className="sub-heading-alarm btn-container">
					<button className="btn save-btn" onClick={() => saveAlarm()}>
						Save Alarm
					</button>
					{play && (
						<button className="btn" onClick={() => setPlay(false)}>
							stop Sound
						</button>
					)}
					{error.error && <div className="danger-text">{error.text}</div>}
					<button
						className="btn delete-btn"
						onClick={() => setAlarm({ ...initialState })}
					>
						Delete Alarm
					</button>
				</div>
			</div>
		</div>
	);
}
