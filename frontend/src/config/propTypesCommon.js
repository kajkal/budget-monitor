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
