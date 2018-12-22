import PropTypes from 'prop-types';


export const lodashPath = PropTypes.arrayOf(
    PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
);

export const categoryRootShape = PropTypes.shape({
    idCategory: PropTypes.number.isRequired,
    path: PropTypes.arrayOf(PropTypes.number).isRequired,
    lodashPath: lodashPath,
    name: PropTypes.string.isRequired,
    color: PropTypes.number.isRequired,
});
categoryRootShape.subCategories = PropTypes.arrayOf(categoryRootShape).isRequired;

export const dateShape = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
]);

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
    date: dateShape.isRequired,
    dateOfAddition: dateShape.isRequired,
    dateOfLastModification: dateShape.isRequired,
    subEntries: PropTypes.arrayOf(subEntryShape).isRequired,
});
