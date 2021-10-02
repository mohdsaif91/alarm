import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react/cjs/react.development';

import rightArrow from '../image/right-arrow.png';
import redCross from '../image/red-cross.png';

import Checkbox from '../components/Checkbox';

const map = {
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
	Sunday: 7,
};

const weekDays = ['Monday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function AlarmList() {
	const [alarmList, setAlarmList] = useState([]);
	const [showDelete, setShowDelete] = useState(false);
	useEffect(() => {
		const al = localStorage.getItem('alarmList');
		const result = JSON.parse(al).sort((a, b) => {
			const aTime = `${a.hours}:${a.minutes}`;
			const bTime = `${b.hours}:${b.minutes}`;
			return aTime.localeCompare(bTime);
		});
		const AM = result.filter((f) => f.meridian === 'AM');
		const PM = result.filter((f) => f.meridian === 'PM');
		setAlarmList([...AM, ...PM]);
	}, []);

	const checkUncheck = (check, index) => {
		alarmList[index].on = check;
		localStorage.setItem('alarmList', JSON.stringify(alarmList));
		setAlarmList([...alarmList]);
	};

	const getDays = (repeat) => {
		if (repeat.length <= 5 && repeat.every((i) => weekDays.includes(i))) {
			return 'WeekDays';
		} else if (repeat.length === 7) {
			return 'Everyday';
		} else if (repeat.length <= 6) {
			return repeat.sort((a, b) => {
				return map[a] - map[b];
			});
		}
	};

	const removeAlarm = (removeAlarmId) => {
		let existAlarm = localStorage.getItem('alarmList');
		existAlarm = JSON.parse(existAlarm);
		const nonDeleted = existAlarm.filter((f) => f.id !== removeAlarmId);
		setAlarmList(nonDeleted);
		localStorage.setItem('alarmList', JSON.stringify(nonDeleted));
	};

	return (
		<div className="alarmlist-container">
			<div className="alarmlist-heading">
				{!showDelete ? (
					<button className="alarm-btn" onClick={() => setShowDelete(true)}>
						Edit
					</button>
				) : (
					<button className="alarm-btn" onClick={() => setShowDelete(false)}>
						Done
					</button>
				)}
				<div>Alarm</div>
				{!showDelete ? (
					<NavLink to="/alarmAdd">
						<button className="alarm-btn">Add</button>
					</NavLink>
				) : (
					<div></div>
				)}
			</div>
			<div className="list-container">
				<div className="white-space">
					{alarmList.length === 0 ? 'No Alarm Set' : 'Alarm is set'}
				</div>
				{alarmList.length !== 0 && (
					<div className="alarm-list">
						<ul className="list-al">
							{alarmList.map((m, index) => (
								<li key={index} className="item">
									<label
										href="#"
										data-template="about"
										data-context-name="about"
										className="item-link item-content"
									>
										{showDelete && (
											<div className="remove-container">
												<img
													alt=""
													src={redCross}
													onClick={() => removeAlarm(m.id)}
												/>
											</div>
										)}
										<div className="time-container">
											<strong className="time">
												<sub>{`${m.hours}:${m.minutes} ${m.meridian}`}</sub>
											</strong>
											<div className="label-repeat">
												<small className="title">
													{m.label && `${m.label}`}
												</small>
												<small>{getDays(m.repeat)}</small>
											</div>
										</div>
									</label>
									{showDelete ? (
										<NavLink
											to={{
												pathname: '/alarmAdd',
												aboutProp: {
													alarmId: m.id,
												},
											}}
										>
											<img alt="" src={rightArrow} />
										</NavLink>
									) : (
										<Checkbox
											checked={m.on}
											onChange={(check) => checkUncheck(check, index)}
										/>
									)}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			<div className="alarm-action-container">
				<NavLink to="/">
					<button className="alarm-btn">Clock</button>
				</NavLink>
			</div>
		</div>
	);
}
