import React, { Component } from 'react'
import { ModalForm } from './styles'


export default class extends Component {
	constructor({ selected, onSave }) {
		super()

		this.state = {
			originName: selected.Name,
			originDescription: selected.Description,
			originRole: selected.Role,
			originDate: selected.Date,
			originType: selected.Type,
			originAttachment: selected.Attachment,
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.onSave = onSave
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	render() {
		return (
			<ModalForm>
				<h1> Name </h1>
				<input
					name="Name"
					type="text"
					value={this.state.originName}
					onChange={this.handleInputChange} />
				<h2> Details </h2>
				<label>Date:</label>
					<input
						name="Date"
						type="date"
						value={this.state.originDate}
						onChange={this.handleInputChange} />
				<label>Role:</label>
					<select
						name="Role"
						value={this.state.originRole}
						onChange={this.handleInputChange} >
						<option value="Creator">Creator</option>
						<option value="Organiser">Organiser</option>
						<option value="Participant">Participant</option>
						<option value="Team Leader">Team Leader</option>
						<option value="Volunteer">Volunteer"</option>
						<option value="Other">Other</option>
					</select>
				<label>Type:</label>
					<select
						name="Type"
						value={this.state.originRole}
						onChange={this.handleInputChange} >
						<option value="Competition">Competition</option>
						<option value="Leardership">Leadership</option>
						<option value="Masterclass">Masterclass</option>
						<option value="Online Course">Online Course</option>
						<option value="Personal Project">Personal Project</option>
						<option value="Reading">Reading</option>
						<option value="Work experience">Work experience</option>
						<option value="Other">Other</option>
					</select>

				<button onClick={ this.onSave }>Save</button>
			</ModalForm>
		)
	}

}
