require "application_system_test_case"

class PassagesharesTest < ApplicationSystemTestCase
  setup do
    @passageshare = passageshares(:one)
  end

  test "visiting the index" do
    visit passageshares_url
    assert_selector "h1", text: "Passageshares"
  end

  test "creating a Passageshare" do
    visit passageshares_url
    click_on "New Passageshare"

    fill_in "Author User", with: @passageshare.author_user_id
    fill_in "Edit Privilege", with: @passageshare.edit_privilege
    fill_in "Passage", with: @passageshare.passage_id
    fill_in "Recieving User", with: @passageshare.recieving_user_id
    click_on "Create Passageshare"

    assert_text "Passageshare was successfully created"
    click_on "Back"
  end

  test "updating a Passageshare" do
    visit passageshares_url
    click_on "Edit", match: :first

    fill_in "Author User", with: @passageshare.author_user_id
    fill_in "Edit Privilege", with: @passageshare.edit_privilege
    fill_in "Passage", with: @passageshare.passage_id
    fill_in "Recieving User", with: @passageshare.recieving_user_id
    click_on "Update Passageshare"

    assert_text "Passageshare was successfully updated"
    click_on "Back"
  end

  test "destroying a Passageshare" do
    visit passageshares_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Passageshare was successfully destroyed"
  end
end
