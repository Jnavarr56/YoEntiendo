class DocumentPassagesController < ApplicationController
  before_action :set_documentpassage, only: [:show, :edit, :update, :destroy]

  # GET /documentpassages
  # GET /documentpassages.json
  def index
    @documentpassages = DocumentPassage.all
  end

  # GET /documentpassages/1
  # GET /documentpassages/1.json
  def show
  end

  # GET /documentpassages/new
  def new
    @documentpassage = DocumentPassage.new
  end

  # GET /documentpassages/1/edit
  def edit
  end

  # POST /documentpassages
  # POST /documentpassages.json
  def create
    @documentpassage = DocumentPassage.new(documentpassage_params)

    respond_to do |format|
      if @documentpassage.save
        format.html { redirect_to @documentpassage, notice: 'Documentpassage was successfully created.' }
        format.json { render :show, status: :created, location: @documentpassage }
      else
        format.html { render :new }
        format.json { render json: @documentpassage.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /documentpassages/1
  # PATCH/PUT /documentpassages/1.json
  def update
    respond_to do |format|
      if @documentpassage.update(documentpassage_params)
        format.html { redirect_to @documentpassage, notice: 'Documentpassage was successfully updated.' }
        format.json { render :show, status: :ok, location: @documentpassage }
      else
        format.html { render :edit }
        format.json { render json: @documentpassage.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /documentpassages/1
  # DELETE /documentpassages/1.json
  def destroy
    @documentpassage.destroy
    respond_to do |format|
      format.html { redirect_to documentpassages_url, notice: 'Documentpassage was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_documentpassage
      @documentpassage = DocumentPassage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def documentpassage_params
      params.require(:documentpassage).permit(:document_id, :passage_id)
    end
end
