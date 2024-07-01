import React from "react";
import { Col, Row } from "react-bootstrap";
import { FiArrowLeft, FiEdit } from "react-icons/fi";


const Header = ({ onBackClick, onEditClick, title }) => {

    return (
        <Row>
            <Col xs={2}>
                {onBackClick && <FiArrowLeft size={24} onClick={onBackClick} />}
            </Col>

            <Col>
                <h1 style={{ fontSize: 20, margin: "0 10px" }}>{title}</h1>
            </Col>

            <Col xs={2}>
                {onEditClick && <FiEdit size={24} onClick={onEditClick} />}
            </Col>
        </Row>
    )
}

export default Header;