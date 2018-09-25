require "application_system_test_case"

class DocumentpassagesTest < ApplicationSystemTestCase
  setup do
    @documentpassage = documentpassages(:one)
  end

  test "visiting the index" do
    visit documentpassages_url
    assert_selector "h1", text: "Documentpassages"
  end

  test "creating a Documentpassage" do
    visit documentpassages_url
    click_on "New Documentpassage"

    fill_in "Document", with: @documentpassage.document_id
    fill_in "Passage", with: @documentpassage.passage_id
    click_on "Create Documentpassage"

    assert_text "Documentpassage was successfully created"
    click_on "Back"
  end

  test "updating a Documentpassage" do
    visit documentpassages_url
    click_on "Edit", match: :first

    fill_in "Document", with: @documentpassage.document_id
    fill_in "Passage", with: @documentpassage.passage_id
    click_on "Update Documentpassage"

    assert_text "Documentpassage was successfully updated"
    click_on "Back"
  end

  test "destroying a Documentpassage" do
    visit documentpassages_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Documentpassage was successfully destroyed"
  end
end
