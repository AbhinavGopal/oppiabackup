// Copyright 2020 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for exploration player page component.
 */

// TODO(#7222): Remove the following block of unnnecessary imports once
// App.ts is upgraded to Angular 8.
import { UpgradedServices } from 'services/UpgradedServices';
import { rootCertificates } from 'tls';
// ^^^ This block is to be removed.

require('pages/exploration-player-page/exploration-player-page.component.ts');

describe('Exploration player page', function() {
  var ctrl = null;
  var $q = null;
  var $rootScope = null;
  var $scope = null;
  var ContextService = null;
  var PageTitleService = null;
  var ReadOnlyExplorationBackendApiService = null;
  var CommandExecutorService = null;

  var explorationId = 'exp1';
  var exploration = {
    title: 'Exploration Title',
    objective: 'Exploration Objective',
  };

  beforeEach(angular.mock.module('oppia', function($provide) {
    var ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(ugs.getUpgradedServices())) {
      $provide.value(key, value);
    }
  }));

  beforeEach(angular.mock.inject(function($injector, $componentController) {
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    ContextService = $injector.get('ContextService');
    PageTitleService = $injector.get('PageTitleService');
    CommandExecutorService = $injector.get('CommandExecutorService');
    ReadOnlyExplorationBackendApiService = $injector.get(
      'ReadOnlyExplorationBackendApiService');

    $scope = $rootScope.$new();
    ctrl = $componentController('explorationPlayerPage', {
      $scope: $scope
    });
  }));

  it('should load skill based on its id on url when component is initialized' +
    ' and set angular element content property based on the exploration',
  function() {
    spyOn(ContextService, 'getExplorationId').and.returnValue(explorationId);
    spyOn(ReadOnlyExplorationBackendApiService, 'fetchExploration').and
      .returnValue($q.resolve({
        exploration: exploration
      }));
    spyOn(PageTitleService, 'setPageTitle').and.callThrough();

    CommandExecutorService.getOuterFrameEvents = 
    jasmine.createSpy("outerFrameEvents spy");
    CommandExecutorService.sendParentReadyState = 
    jasmine.createSpy("sendParentReadyState spy");
    CommandExecutorService.sendStateToOuterFrame = 
    jasmine.createSpy('sendStateToOuterFrame spy');
    var angularElementSpy = spyOn(angular, 'element');

    var elementNameItemProp = $('<div>');
    angularElementSpy.withArgs(
      // @ts-ignore Angular element method doesn't expect to receive 1 argument
      // in the lints.
      'meta[itemprop="name"]').and.returnValue(elementNameItemProp);

    var elementDescriptionItemProp = $('<div>');
    angularElementSpy.withArgs(
      // @ts-ignore Angular element method doesn't expect to receive 1 argument
      // in the lints.
      'meta[itemprop="description"]').and.returnValue(
      elementDescriptionItemProp);

    var elementTitleProperty = $('<div>');
    angularElementSpy.withArgs(
      // @ts-ignore Angular element method doesn't expect to receive 1 argument
      // in the lints.
      'meta[property="og:title"]').and.returnValue(elementTitleProperty);

    var elementDescriptionProperty = $('<div>');
    angularElementSpy.withArgs(
      // @ts-ignore Angular element method doesn't expect to receive 1 argument
      // in the lints.
      'meta[property="og:description"]').and.returnValue(
      elementDescriptionProperty);

    ctrl.$onInit();
    $scope.$apply();

    expect(PageTitleService.setPageTitle).toHaveBeenCalledWith(
      'Exploration Title - Oppia');
    expect(elementNameItemProp.attr('content')).toBe(exploration.title);
    expect(elementDescriptionItemProp.attr('content')).toBe(
      exploration.objective);
    expect(elementTitleProperty.attr('content')).toBe(exploration.title);
    expect(elementDescriptionProperty.attr('content')).toBe(
      exploration.objective);
    expect(CommandExecutorService.getOuterFrameEvents)
    .toHaveBeenCalled();
    expect(CommandExecutorService.sendParentReadyState)
    .toHaveBeenCalled();
    $rootScope.$broadcast('livePlayerStateChange', 'CONTINUE');
    $rootScope.$apply();
    $scope.$apply();
    expect(CommandExecutorService.sendStateToOuterFrame).toHaveBeenCalled();
  });
});
