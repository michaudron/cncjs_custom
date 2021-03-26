import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import { Input } from 'app/components/FormControl';
import FormGroup from 'app/components/FormGroup';
import { FlexContainer, Row, Col } from 'app/components/GridSystem';
import Margin from 'app/components/Margin';
import Modal from 'app/components/Modal';
import { ToastNotification } from 'app/components/Notifications';
import SectionGroup from 'app/components/SectionGroup';
import SectionTitle from 'app/components/SectionTitle';
import i18n from 'app/lib/i18n';
import Error from '../common/Error';
import * as validations from '../common/validations';
import Axis from './Axis';

class CreateRecord extends Component {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    state = this.getInitialState();

    getInitialState() {
        return {
            values: {
                name: '',
                limits: {
                    xmin: 0,
                    xmax: 0,
                    ymin: 0,
                    ymax: 0,
                    zmin: 0,
                    zmax: 0,
                },
                toolInSpindle: '',
                toolBase: {
                    zpos: 0,
                    xpos: 0,
                    ypos: 0,
                    ysafe: 0,
                    zsafe: 0
                },
                toolSlots: {
                    slot1: 0,
                    slot2: 0,
                    slot3: 0,
                    slot4: 0,
                    slot5: 0,
                    slot6: 0,
                    slot7: 0,
                    slot8: 0
                },
                probeLocation: {
                    zsafe: 0,
                    xpos: 0,
                    ypos: 0,
                    distance: 0
                }
            }
        };
    }

    onSubmit = (values) => {
        const { createRecord } = this.props.actions;

        createRecord({
            name: _get(values, 'name', ''),
            limits: {
                xmin: Number(_get(values, 'limits.xmin')) || 0,
                xmax: Number(_get(values, 'limits.xmax')) || 0,
                ymin: Number(_get(values, 'limits.ymin')) || 0,
                ymax: Number(_get(values, 'limits.ymax')) || 0,
                zmin: Number(_get(values, 'limits.zmin')) || 0,
                zmax: Number(_get(values, 'limits.zmax')) || 0,
            },
            toolInSpindle: _get(values, 'toolInSpindle', ''),
            toolBase: {
                zpos: Number(_get(values, 'toolBase.zpos')) || 0,
                xpos: Number(_get(values, 'toolBase.xpos')) || 0,
                ypos: Number(_get(values, 'toolBase.ypos')) || 0,
                ysafe: Number(_get(values, 'toolBase.ysafe')) || 0,
                zsafe: Number(_get(values, 'toolBase.zsafe')) || 0
            },
            toolSlots: {
                slot1: Number(_get(values, 'toolSlots.slot1')) || 0,
                slot2: Number(_get(values, 'toolSlots.slot2')) || 0,
                slot3: Number(_get(values, 'toolSlots.slot3')) || 0,
                slot4: Number(_get(values, 'toolSlots.slot4')) || 0,
                slot5: Number(_get(values, 'toolSlots.slot5')) || 0,
                slot6: Number(_get(values, 'toolSlots.slot6')) || 0,
                slot7: Number(_get(values, 'toolSlots.slot7')) || 0,
                slot8: Number(_get(values, 'toolSlots.slot8')) || 0
            },
            probeLocation: {
                zsafe: Number(_get(values, 'probeLocation.zsafe')) || 0,
                xpos: Number(_get(values, 'probeLocation.xpos')) || 0,
                ypos: Number(_get(values, 'probeLocation.ypos')) || 0,
                distance: Number(_get(values, 'probeLocation.distance')) || 0
            }
        });
    };

    renderLimits = () => (
        <FlexContainer fluid gutterWidth={0}>
            <Row>
                <Col>
                    <Field name="limits.xmin">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="X" sub="min" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="limits.xmax">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="X" sub="max" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Field name="limits.ymin">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Y" sub="min" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="limits.ymax">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Y" sub="max" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Field name="limits.zmin">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Z" sub="min" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="limits.zmax">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Z" sub="max" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
        </FlexContainer>
    );

    renderToolBase = () => (
        <FlexContainer fluid gutterWidth={0}>
            <Row>
                <Col>
                    <Field name="toolBase.xpos">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="X" sub="Base" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolBase.ypos">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Y" sub="Base" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolBase.zpos">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Z" sub="Base" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Field name="toolBase.zsafe">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Z" sub="Safe" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolBase.ysafe">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Y" sub="Safe" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
        </FlexContainer>
    );

    renderToolSlots = () => (
        <FlexContainer fluid gutterWidth={0}>
            <Row>
                <Col>
                    <Field name="toolInSpindle">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="In Spindle" sub="" /></label>
                                <Input {...input} type="text" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Field name="toolSlots.slot1">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Slot 1" sub="X" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolSlots.slot2">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Slot 2" sub="X" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolSlots.slot3">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Slot 3" sub="X" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolSlots.slot4">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Slot 4" sub="X" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Field name="toolSlots.slot5">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Slot 5" sub="X" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolSlots.slot6">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Slot 6" sub="X" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolSlots.slot7">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Slot 7" sub="X" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="toolSlots.slot8">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Slot 8" sub="X" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
        </FlexContainer>
    );

    renderProbeLocation = () => (
        <FlexContainer fluid gutterWidth={0}>
            <Row>
                <Col>
                    <Field name="probeLocation.xpos">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="X" sub="Pos" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="probeLocation.ypos">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Y" sub="Pos" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="probeLocation.zsafe">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Z" sub="Safe" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
                <Col width="auto" style={{ width: 16 }} />
                <Col>
                    <Field name="probeLocation.distance">
                        {({ input, meta }) => (
                            <FormGroup>
                                <label><Axis value="Distance" sub="" /></label>
                                <Input {...input} type="number" />
                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                            </FormGroup>
                        )}
                    </Field>
                </Col>
            </Row>
        </FlexContainer>
    );

    render() {
        const { closeModal, updateModalParams } = this.props.actions;
        const { alertMessage } = this.props.state.modal.params;

        return (
            <Modal disableOverlay onClose={closeModal}>
                <Form
                    initialValues={this.state.values}
                    onSubmit={this.onSubmit}
                    render={({ handleSubmit, pristine, invalid }) => (
                        <div>
                            <Modal.Header>
                                <Modal.Title>
                                    {i18n._('Machine Profile')}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {alertMessage && (
                                    <ToastNotification
                                        style={{ margin: '-16px -24px 10px -24px' }}
                                        type="error"
                                        onDismiss={() => {
                                            updateModalParams({ alertMessage: '' });
                                        }}
                                    >
                                        {alertMessage}
                                    </ToastNotification>
                                )}
                                <SectionGroup>
                                    <Field name="name" validate={validations.required}>
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <label>{i18n._('Name')}</label>
                                                <Input {...input} type="text" />
                                                {meta.touched && meta.error && <Error>{meta.error}</Error>}
                                            </FormGroup>
                                        )}
                                    </Field>
                                </SectionGroup>
                                <SectionGroup style={{ marginBottom: 0 }}>
                                    <SectionTitle>{i18n._('Limits')}</SectionTitle>
                                    <Margin left={24}>
                                        {this.renderLimits()}
                                    </Margin>
                                </SectionGroup>
                                <SectionGroup style={{ marginBottom: 0 }}>
                                    <SectionTitle>{i18n._('Tool Base')}</SectionTitle>
                                    <Margin left={24}>
                                        {this.renderToolBase()}
                                    </Margin>
                                </SectionGroup>
                                <SectionGroup style={{ marginBottom: 0 }}>
                                    <SectionTitle>{i18n._('Tool Slots')}</SectionTitle>
                                    <Margin left={24}>
                                        {this.renderToolSlots()}
                                    </Margin>
                                </SectionGroup>
                                <SectionGroup style={{ marginBottom: 0 }}>
                                    <SectionTitle>{i18n._('Probe Location')}</SectionTitle>
                                    <Margin left={24}>
                                        {this.renderProbeLocation()}
                                    </Margin>
                                </SectionGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={closeModal}
                                >
                                    {i18n._('Cancel')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={pristine || invalid}
                                    onClick={handleSubmit}
                                >
                                    {i18n._('OK')}
                                </button>
                            </Modal.Footer>
                        </div>
                    )}
                />
            </Modal>
        );
    }
}

export default CreateRecord;
