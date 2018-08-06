import React, {Component} from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'

class ContactData extends Component {

	state ={
		name: '',
		email: '',
		address: {
			street: '',
			postalCode: ''
		},
		loading: false
	};

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({loading: true});
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.totalPrice,
			customer: {
				name: 'Igor Sz',
				addres: {
					street: 'Alternatywy',
					zipCode: '02-775',
					country: 'Poland'
				},
				email: 'pl4cek@outlook.com',
			},
			deliveryMethod: 'fastest'
		};
		axios.post('/orders.json', order)
			.then(response => {
				this.setState({loading: false});
				this.props.history.push('/');
			})
			.catch(error => {
				this.setState({loading: false});
			});
	};

	render() {
		let form  = (
			<form>
				<input className={classes.Input} type ='text' name='name' placeholder='Imie' />
				<input className={classes.Input} type ='text' name='email' placeholder='Email' />
				<input className={classes.Input} type ='text' name='street' placeholder='Street' />
				<input className={classes.Input} type ='text' name='postal' placeholder='Kod pocztowy' />
				<Button btnType='Success' clicked = {this.orderHandler}>ZAMÓW</Button>
			</form>);
		if (this.state.loading){
			form = <Spinner/>
		}
		return (
			<div className={classes.ContactData}>
				<h4>Podaj dane kontaktowe</h4>
				{form}
			</div>
		)
	}
}

export default ContactData;