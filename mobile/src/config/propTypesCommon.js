import PropTypes from 'prop-types';


export const lodashPathShape = PropTypes.arrayOf(
    PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
);

export const categoryShape = PropTypes.shape({
    idCategory: PropTypes.number.isRequired,
    path: PropTypes.arrayOf(PropTypes.number).isRequired,
    lodashPath: lodashPathShape,
    name: PropTypes.string.isRequired,
});
categoryShape.subCategories = PropTypes.arrayOf(categoryShape).isRequired;

export const subEntryShape = PropTypes.shape({
    idSubEntry: PropTypes.number.isRequired,
    idCategory: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
});

export const entryShape = PropTypes.shape({
    idEntry: PropTypes.number.isRequired,
    idCategory: PropTypes.number,
    description: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    date: PropTypes.number.isRequired,
    dateOfAddition: PropTypes.number.isRequired,
    dateOfLastModification: PropTypes.number.isRequired,
    subEntries: PropTypes.arrayOf(subEntryShape).isRequired,
});
