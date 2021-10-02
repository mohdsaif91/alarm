import { Switch, Route, withRouter } from 'react-router';
import AlarmAdd from './Pages/AlarmAdd';
import AlarmEdit from './Pages/AlarmEdit';

import AlarmHome from './Pages/AlarmHome';
import AlarmList from './Pages/AlarmList';
import AlarmRing from './Pages/AlarmRing';

function App() {
	return (
		<div className="App">
			<Switch>
				<Route exact path="/" component={AlarmHome} />
				<Route path="/alarmList" component={AlarmList} />
				<Route path="/alarmEdit" component={AlarmEdit} />
				<Route path="/alarmAdd" component={AlarmAdd} />
				<Route path="/alarmRing" component={AlarmRing} />
			</Switch>
		</div>
	);
}

export default withRouter(App);
