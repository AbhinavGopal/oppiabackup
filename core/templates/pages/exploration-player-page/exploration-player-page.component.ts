// Copyright 2019 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Component for the explaration player page.
 */
import 'mousetrap';
import { ServicesConstants } from 'services/services.constants';

require('components/on-screen-keyboard/on-screen-keyboard.component.ts');
require('base-components/base-content.directive.ts');
require(
  'components/common-layout-directives/common-elements/' +
  'attribution-guide.component.ts');
require(
  'components/common-layout-directives/common-elements/' +
  'background-banner.component.ts');
require(
  'components/forms/schema-based-editors/schema-based-editor.directive.ts');
require(
  'pages/exploration-player-page/learner-experience/' +
  'conversation-skin.directive.ts');

require('interactions/interactionsRequires.ts');
require('objects/objectComponentsRequiresForPlayers.ts');
require('pages/exploration-player-page/services/command-executor.service.ts');

angular.module('oppia').component('explorationPlayerPage', {
  template: require('./exploration-player-page.component.html'),
  controller: [
    'ContextService', '$timeout', 'PageTitleService',
    'ReadOnlyExplorationBackendApiService',
    'CommandExecutorService', 'WindowWrapperMessageService',
    'WindowRef', 'CurrentInteractionService',
    function(
        ContextService, $timeout, PageTitleService,
        ReadOnlyExplorationBackendApiService,
        CommandExecutorService, WindowWrapperMessageService,
        WindowRef, CurrentInteractionService) {
      var ctrl = this;
      var keyword = 'secret_hostname';
      var numberOfSetEntries = 0;
      var getUrlParams = function() {
        var urlParams = {};
        var parts = WindowWrapperMessageService.getLocationHref().replace(
          /[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            urlParams[key] = value;
          });
        return urlParams;
      };
      ctrl.$onInit = function() {
        var urlParams = getUrlParams();

        if (urlParams[keyword] !== undefined &&
          ServicesConstants.WHITELISTED_IFRAME_SECRETS.indexOf(
            urlParams[keyword]) >= 0) {
          CommandExecutorService.initialize();
          CommandExecutorService.sendParentReadyState();
        }

        var explorationId = ContextService.getExplorationId();
        ReadOnlyExplorationBackendApiService.fetchExploration(
          explorationId, null)
          .then(function(response) {
            PageTitleService.setPageTitle(
              response.exploration.title + ' - Oppia');
            angular.element('meta[itemprop="name"]').attr(
              'content', response.exploration.title);
            angular.element('meta[itemprop="description"]').attr(
              'content', response.exploration.objective);
            angular.element('meta[property="og:title"]').attr(
              'content', response.exploration.title);
            angular.element('meta[property="og:description"]').attr(
              'content', response.exploration.objective);
          });

        var bindExplorationPlayerShortcuts = function() {
          Mousetrap.bind('s', function() {
            document.getElementById('skipToMainContentId').focus();
            return false;
          });

          Mousetrap.bind('k', function() {
            var previousButton = document.getElementById('backButtonId');
            if (previousButton !== null) {
              previousButton.focus();
            }
            return false;
          });

          Mousetrap.bind('j', function() {
            var nextButton = <HTMLElement>document.querySelector(
              '.protractor-test-next-button');
            var continueToNextCardButton = <HTMLElement>document.querySelector(
              '.protractor-test-continue-to-next-card-button');
            var continueButton = <HTMLElement>document.querySelector(
              '.protractor-test-continue-button');
            if (nextButton !== null) {
              nextButton.focus();
            }
            if (continueToNextCardButton !== null) {
              continueToNextCardButton.focus();
            }
            if (continueButton !== null) {
              continueButton.focus();
            }
            return false;
          });
        };
        bindExplorationPlayerShortcuts();
      };
    }
  ]
});
