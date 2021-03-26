import _get from 'lodash/get';
import _set from 'lodash/set';
import _find from 'lodash/find';
import _castArray from 'lodash/castArray';
import _isPlainObject from 'lodash/isPlainObject';
import uuid from 'uuid';
import settings from '../config/settings';
import { ensureNumber, ensureString } from '../lib/ensure-type';
import logger from '../lib/logger';
import config from '../services/configstore';
import { getPagingRange } from './paging';
import {
    ERR_BAD_REQUEST,
    ERR_NOT_FOUND,
    ERR_INTERNAL_SERVER_ERROR
} from '../constants';

const log = logger('api:machines');
const CONFIG_KEY = 'machines';

const getSanitizedRecords = () => {
    const records = _castArray(config.get(CONFIG_KEY, []));

    let shouldUpdate = false;
    for (let i = 0; i < records.length; ++i) {
        if (!_isPlainObject(records[i])) {
            records[i] = {};
        }

        const record = records[i];

        if (!record.id) {
            record.id = uuid.v4();
            shouldUpdate = true;
        }
    }

    if (shouldUpdate) {
        log.debug(`update sanitized records: ${JSON.stringify(records)}`);

        // Pass `{ silent changes }` will suppress the change event
        config.set(CONFIG_KEY, records, { silent: true });
    }

    return records;
};

const ensureMachineProfile = (payload) => {
    const { id, name, limits, toolInSpindle, toolBase, toolSlots, probeLocation } = { ...payload };
    const { xmin = 0, xmax = 0, ymin = 0, ymax = 0, zmin = 0, zmax = 0 } = { ...limits };
    const { zpos = 0, xpos = 0, ypos = 0, ysafe = 0, zsafe = 0 } = { ...toolBase };
    const { slot1 = 0, slot2 = 0, slot3 = 0, slot4 = 0, slot5 = 0, slot6 = 0, slot7 = 0, slot8 = 0 } = { ...toolSlots };

    return {
        id,
        name: ensureString(name),
        limits: {
            xmin: ensureNumber(xmin) || 0,
            xmax: ensureNumber(xmax) || 0,
            ymin: ensureNumber(ymin) || 0,
            ymax: ensureNumber(ymax) || 0,
            zmin: ensureNumber(zmin) || 0,
            zmax: ensureNumber(zmax) || 0,
        },
        toolInSpindle: ensureString(toolInSpindle),
        toolBase: {
            zpos: ensureNumber(zpos) || 0,
            xpos: ensureNumber(xpos) || 0,
            ypos: ensureNumber(ypos) || 0,
            ysafe: ensureNumber(ysafe) || 0,
            zsafe: ensureNumber(zsafe) || 0
        },
        toolSlots: {
            slot1: ensureNumber(slot1) || 0,
            slot2: ensureNumber(slot2) || 0,
            slot3: ensureNumber(slot3) || 0,
            slot4: ensureNumber(slot4) || 0,
            slot5: ensureNumber(slot5) || 0,
            slot6: ensureNumber(slot6) || 0,
            slot7: ensureNumber(slot7) || 0,
            slot8: ensureNumber(slot8) || 0
        },
        probeLocation: {
            zsafe: ensureNumber(probeLocation.zsafe) || 0,
            xpos: ensureNumber(probeLocation.xpos) || 0,
            ypos: ensureNumber(probeLocation.ypos) || 0,
            distance: ensureNumber(probeLocation.distance) || 0
        }
    };
};

export const fetch = (req, res) => {
    const records = getSanitizedRecords();
    const paging = !!req.query.paging;

    if (paging) {
        const { page = 1, pageLength = 10 } = req.query;
        const totalRecords = records.length;
        const [begin, end] = getPagingRange({ page, pageLength, totalRecords });
        const pagedRecords = records.slice(begin, end);

        res.send({
            pagination: {
                page: Number(page),
                pageLength: Number(pageLength),
                totalRecords: Number(totalRecords)
            },
            records: pagedRecords.map(record => ensureMachineProfile(record))
        });
    } else {
        res.send({
            records: records.map(record => ensureMachineProfile(record))
        });
    }
};

export const create = (req, res) => {
    const record = { ...req.body };

    if (!record.name) {
        res.status(ERR_BAD_REQUEST).send({
            msg: 'The "name" parameter must not be empty'
        });
        return;
    }

    try {
        const records = getSanitizedRecords();
        records.push(ensureMachineProfile(record));
        config.set(CONFIG_KEY, records);

        res.send({ id: record.id });
    } catch (err) {
        res.status(ERR_INTERNAL_SERVER_ERROR).send({
            msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
        });
    }
};

export const read = (req, res) => {
    const id = req.params.id;
    const records = getSanitizedRecords();
    const record = _find(records, { id: id });

    if (!record) {
        res.status(ERR_NOT_FOUND).send({
            msg: 'Not found'
        });
        return;
    }

    res.send(ensureMachineProfile(record));
};

export const update = (req, res) => {
    const id = req.params.id;
    const records = getSanitizedRecords();
    const record = _find(records, { id: id });

    if (!record) {
        res.status(ERR_NOT_FOUND).send({
            msg: 'Not found'
        });
        return;
    }

    try {
        const nextRecord = req.body;

        [ // [key, ensureType]
            ['name', ensureString],
            ['limits.xmin', ensureNumber],
            ['limits.xmax', ensureNumber],
            ['limits.ymin', ensureNumber],
            ['limits.ymax', ensureNumber],
            ['limits.zmin', ensureNumber],
            ['limits.zmax', ensureNumber],
            ['toolInSpindle', ensureString],
            ['toolBase.zpos', ensureNumber],
            ['toolBase.xpos', ensureNumber],
            ['toolBase.ypos', ensureNumber],
            ['toolBase.ysafe', ensureNumber],
            ['toolBase.zsafe', ensureNumber],
            ['toolSlots.slot1', ensureNumber],
            ['toolSlots.slot2', ensureNumber],
            ['toolSlots.slot3', ensureNumber],
            ['toolSlots.slot4', ensureNumber],
            ['toolSlots.slot5', ensureNumber],
            ['toolSlots.slot6', ensureNumber],
            ['toolSlots.slot7', ensureNumber],
            ['toolSlots.slot8', ensureNumber],
            ['probeLocation.zsafe', ensureNumber],
            ['probeLocation.xpos', ensureNumber],
            ['probeLocation.ypos', ensureNumber],
            ['probeLocation.distance', ensureNumber]
        ].forEach(it => {
            const [key, ensureType] = it;
            const defaultValue = _get(record, key);
            const value = _get(nextRecord, key, defaultValue);

            _set(record, key, (typeof ensureType === 'function') ? ensureType(value) : value);
        });

        config.set(CONFIG_KEY, records);

        res.send({ id: record.id });
    } catch (err) {
        res.status(ERR_INTERNAL_SERVER_ERROR).send({
            msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
        });
    }
};

export const __delete = (req, res) => {
    const id = req.params.id;
    const records = getSanitizedRecords();
    const record = _find(records, { id: id });

    if (!record) {
        res.status(ERR_NOT_FOUND).send({
            msg: 'Not found'
        });
        return;
    }

    try {
        const filteredRecords = records.filter(record => {
            return record.id !== id;
        });
        config.set(CONFIG_KEY, filteredRecords);

        res.send({ id: record.id });
    } catch (err) {
        res.status(ERR_INTERNAL_SERVER_ERROR).send({
            msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
        });
    }
};
