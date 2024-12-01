import React from 'react';

import styles from './Card.module.css';

type CardProps = {
    date: Date,
    text: string,
    onTextChange: (day: number, val: string) => void
}

type CardState = {
    text: string
}

class Card extends React.Component<CardProps, CardState> {
    private setBackground() {
        if (this.props.date.getDay() === 0 || this.props.date.getDay() === 6) {
            return { backgroundColor: '#CCC' }
        }
        return {}
    }

    private onTextChanged(e: any) {
        this.props.onTextChange(this.props.date.getDate(), e.target.value);
    }

    render() {
        return (
            <div style={this.setBackground()} className={styles.cardContainer}>
                <div className={styles.cardDate}>
                    {this.props.date.getDate()}
                </div>
                <input className={styles.cardLetter} type='text' maxLength={1} value={this.props.text} onChange={this.onTextChanged.bind(this)} />
            </div>
        )
    }
}

export default Card;
