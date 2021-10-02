import React, { useEffect, useState } from 'react';

export default function Checkbox({ checked, onChange }) {
	const [check, setCheck] = useState(false);
	useEffect(() => {
		setCheck(checked);
	}, [checked]);
	return <input type="checkbox" checked={check} onChange={(e) => onChange(e.target.checked)} />;
}
