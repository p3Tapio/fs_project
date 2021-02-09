describe('Creating a new list', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
  })
  it('User can create a new list', function () {
    cy.get('#createList').click();
    cy.contains('+').click().click();
    cy.get('#name').type('test list');
    cy.get('#description').type('description for testing');
    cy.get('#visibility').check({force: true});
    cy.contains('Save').click();
    cy.contains('New list created');
    cy.contains('Ok').click();
    cy.contains('test list')
  })
  it('List doesnt get created and correct error messages are shown if required values are missing', function () {
    cy.get('#createList').click();
    cy.contains('Save').click();
    cy.contains('Please set a default view for your location list.');
    cy.contains('Name is required.');
    cy.contains('Description is required.');
  })
  it('Clicking cancel closes the window without saving the list and the form is empty when reopened', function(){
    cy.get('#createList').click();
    cy.contains('+').click().click();
    cy.get('#name').type('test list');
    cy.get('#description').type('description for testing');
    cy.contains('Cancel').click();
    cy.contains('test list').should('not.exist');
    cy.get('#createList').click();
    cy.get('#name').should('have.value', '');
    cy.get('#description').should('have.value', '');
    cy.contains('Cancel').click();
  })
  it('Public list is visible for all', function () {
    cy.createPublicList(); 
    cy.contains('Logout').click();
    cy.contains('Location lists').click();
    cy.contains('test list');
    cy.contains('description for testing');
  })
  it('Private list is shown to user who created it, but not listed among public ones', function() {
    cy.createPrivateList();
    cy.contains('Private list').click();
    cy.contains('description for private list');
    cy.contains('Logout').click();
    cy.contains('Location lists').click();
    cy.contains('Private list').should('not.exist');
  })
  it('Private is shown only to user who created it but not to other registered users', function () {
    cy.createPrivateList();
    cy.contains('Private list').click();
    cy.contains('description for private list');
    cy.contains('Logout').click();
    cy.registerAndLoginAnother();
    cy.contains('Hi, another!')
    cy.contains('Private list').should('not.exist');
  })
})
describe('Editing a list', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
  })
  it('List can be edited', function() {
    cy.contains('test list').click();
    cy.contains('Edit').click();
    cy.contains('Edit list details').click();
    cy.get('#name').clear();
    cy.get('#name').type('Edited list');
    cy.get('#place').clear();
    cy.get('#place').type('Place');
    cy.get('#country').clear();
    cy.get('#country').type('Country');
    cy.get('#description').clear();
    cy.get('#description').type('Edited description');
    cy.contains('Save').click();
    cy.contains('Ok').click();
    cy.contains('Edited list');
    cy.contains('Place, Country');
    cy.contains('Userpage').click();
    cy.contains('Edited list').click();
    cy.contains('Edited description');
  })
  it('When values are missing, validation messages are shown', function () {
    cy.contains('test list').click();
    cy.contains('Edit').click();
    cy.contains('Edit list details').click();
    cy.get('#name').clear();
    cy.get('#place').clear();
    cy.get('#country').clear();
    cy.get('#description').clear();
    cy.contains('Save').click();
    cy.contains('Name is required.');
    cy.contains('Place is required.');
    cy.contains('Country is required.');
    cy.contains('Description is required.');
  })
  it('Clicking cancel closes modal and no changes are saved', function () {
    cy.contains('test list').click();
    cy.contains('Edit').click();
    cy.contains('Edit list details').click();
    cy.get('#name').clear();
    cy.get('#name').type('Edited list');
    cy.get('#place').clear();
    cy.get('#place').type('Place');
    cy.get('#country').clear();
    cy.get('#country').type('Country');
    cy.get('#description').clear();
    cy.get('#description').type('Edited description');
    cy.contains('Cancel').click();
    cy.contains('Userpage').click();
    cy.contains('test list').click();
    cy.contains('description for testing');
  })
  it('Editing option is not shown in public lists', function() {
    cy.contains('Location lists').click();
    cy.contains('Details').first().click();
    cy.contains('Edit list details').should('not.exist');
  })
})
describe('Deleting a list', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
  })
  it('List can be deleted', function() {
    cy.contains('test list').click();
    cy.contains('Delete').click();
    cy.contains('Are you sure you want to delete test list?');
    cy.get('#confirmDelete').click();
    cy.contains('List test list deleted!');
    cy.contains('Ok').click();
    cy.contains('test list').should('not.exist');
  })
  it('If cancel is clicked, list is not deleted', function() {
    cy.contains('test list').click();
    cy.contains('Delete').click();
    cy.contains('Are you sure you want to delete test list?');
    cy.contains('Cancel').click();
    cy.contains('test list');
  })
})