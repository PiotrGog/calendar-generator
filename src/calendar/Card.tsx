import React from 'react';

import styles from './Card.module.css';

type CardProps = {
    date: Date
}

type CardState = {
    text: string
}

class Card extends React.Component<CardProps, CardState> {
    public constructor(props: CardProps) {
        super(props);

        this.state = {
            text: ""
        }
    }

    private setBackground() {
        if (this.props.date.getDay() === 0 || this.props.date.getDay() === 6) {
            return { backgroundColor: '#CCC' }
        }
        return {}
    }

    private onTextChanged(e: any) {
        this.setState({
            text: e.target.value
        });
    }

    public getText() {
        return this.state.text;
    }

    public getDay() {
        return this.props.date.getDate();
    }

    render() {
        return (
            <div style={this.setBackground()} className={styles.cardContainer}>
                <div className={styles.cardDate}>
                    {this.props.date.getDate()}
                </div>
                <input className={styles.cardLetter} type='text' maxLength={1} value={this.state.text} onChange={this.onTextChanged.bind(this)} />
            </div>
        )
    }
}

export default Card;
