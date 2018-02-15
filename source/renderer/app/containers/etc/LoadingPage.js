// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { shell } from 'electron';
import CenteredLayout from '../../components/layout/CenteredLayout';
import Loading from '../../components/loading/Loading';
import type { StoresMap } from '../../stores/index';
import etcLogo from '../../assets/images/etc-logo.inline.svg';
import mantisLogo from '../../assets/images/mantis-logo.inline.svg';
import { messages } from '../LoadingPage';

type Props = {
  stores: StoresMap,
};

@inject(['stores']) @observer
export default class LoadingPage extends Component<Props> {

  render() {
    const { stores } = this.props;
    const {
      isConnecting, isSyncing, isSynced, syncPercentage, hasBeenConnected,
      hasBlockSyncingStarted, localTimeDifference, ALLOWED_TIME_DIFFERENCE,
    } = stores.networkStatus;
    const { hasLoadedCurrentLocale, hasLoadedCurrentTheme, currentLocale } = stores.profile;
    return (
      <CenteredLayout>
        <Loading
          currencyIcon={etcLogo}
          apiIcon={mantisLogo}
          isSyncing={isSyncing}
          localTimeDifference={localTimeDifference}
          allowedTimeDifference={ALLOWED_TIME_DIFFERENCE}
          isConnecting={isConnecting}
          syncPercentage={syncPercentage}
          isLoadingDataForNextScreen={!isSyncing || isSynced}
          loadingDataForNextScreenMessage={messages.loadingWalletData}
          hasBeenConnected={hasBeenConnected}
          hasBlockSyncingStarted={hasBlockSyncingStarted}
          hasLoadedCurrentLocale={hasLoadedCurrentLocale}
          hasLoadedCurrentTheme={hasLoadedCurrentTheme}
          currentLocale={currentLocale}
          onProblemSolutionClick={this.handleProblemSolutionClick}
        />
      </CenteredLayout>
    );
  }

  handleProblemSolutionClick = (link: string) => {
    shell.openExternal(`https://${link}`);
  }
}
