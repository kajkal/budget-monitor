import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { categoryRootShape } from '../../config/propTypesCommon';
import withMobileDialog from '@material-ui/core/es/withMobileDialog/withMobileDialog';
import { desktopDialogMaxWidth, mobileDialogBreakpoint } from '../../config/theme';
import Dialog from '@material-ui/core/es/Dialog/Dialog';
import Tabs from '@material-ui/core/es/Tabs/Tabs';
import Tab from '@material-ui/core/es/Tab/Tab';
import CategoryOptionTab from './CategoryOptionTab';


class CategoryOptionDialog extends PureComponent {
    state = {
        openTabId: 0,
    };

    handleTabChange = (event, openTabId) => {
        this.setState({ openTabId });
    };

    renderCategoryTab = (openTabId, tabId, categoryType) => {
        if (openTabId !==tabId) return null;
        const { rootCategory, onRootCategoryChange, onClose } = this.props;
        return (
            <CategoryOptionTab
                type={categoryType}
                rootCategory={rootCategory}
                onClose={onClose}
                onRootCategoryChange={onRootCategoryChange}
            />
        );
    };

    render() {
        const { openTabId } = this.state;
        const { open, onClose, rootCategory, fullScreen } = this.props;

        if (!rootCategory) return null;
        return (
            <Dialog
                fullScreen={fullScreen}
                scroll={'body'}
                maxWidth={desktopDialogMaxWidth}
                fullWidth={true}

                open={open}
                onClose={onClose}
                disableBackdropClick={true}
                onEscapeKeyDown={onClose}
                aria-labelledby='category-tab-dialog'
            >

                <Tabs
                    value={openTabId}
                    onChange={this.handleTabChange}
                    indicatorColor='primary'
                    textColor='primary'
                    centered
                    fullWidth
                >

                    <Tab label='Income' />
                    <Tab label='Expense' />

                </Tabs>

                {this.renderCategoryTab(openTabId, 0, 'income')}
                {this.renderCategoryTab(openTabId, 1, 'expense')}

            </Dialog>
        );
    }
}

CategoryOptionDialog.propTypes = {
    rootCategory: categoryRootShape,
    onRootCategoryChange: PropTypes.func.isRequired,

    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog({ breakpoint: mobileDialogBreakpoint })(CategoryOptionDialog);
