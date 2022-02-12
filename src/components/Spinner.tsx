import React, { useState } from "react";
import { Spinner as Bspin, Modal } from "react-bootstrap";

interface SpinProps {
    center: boolean
    show: boolean
}

const Spinner: React.FC = ({children}) => {
    const [showSpin, setShowSpin] = useState(false)
    const toggle = () => {
        setShowSpin(!showSpin)
    }
    const thinker = (
			<div className='thinker'>
				<span className='think-text'>Loading...</span>
				<Bspin animation='grow' className='spin' variant='primary' />
			</div>
		)
		const modal = (
			<Modal
				centered
				dialogClassName='modal-50w'
				show={showSpin}
				backdrop='static'
				keyboard={false}>
				{thinker}
			</Modal>
		)
        const childrenWithToggle = React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {toggle})
            }
            return child
        })
        return <>{childrenWithToggle}{modal}</>
}

export default Spinner