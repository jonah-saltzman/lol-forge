import React, { useState } from "react";
import { Spinner as Bspin, Modal } from "react-bootstrap";

export const Spinner = (props: SpinProps) => {
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
				show={props.show}
				backdrop='static'
				keyboard={false}>
				{thinker}
			</Modal>
		)
        return modal
}