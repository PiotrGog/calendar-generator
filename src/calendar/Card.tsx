import React from 'react';

import styles from './Card.module.css';

type CardProps = {
    date: Date
}

class Card extends React.Component<CardProps, {}> {
    private setBackground() {
        if (this.props.date.getDay() === 0 || this.props.date.getDay() === 6) {
            return { backgroundColor: '#CCC' }
        }
        return {}
    }

    render() {
        return (
            <div style={this.setBackground()} className={styles.cardContainer}>
                <div className={styles.cardDate}>
                    {this.props.date.getDate()}
                </div>
                <input className={styles.cardLetter} type='text' maxLength={1} />
            </div>
        )
    }
}

export default Card;
